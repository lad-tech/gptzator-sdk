import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '../errors/ApiError';
import { TokenStorage, RefreshFn } from '../auth/types';

export type HttpClientOptions = {
  baseURL: string;
  tokenStorage: TokenStorage;
  /** Функция обновления токена. Если не передана — refresh не выполняется */
  refreshFn?: RefreshFn;
  /** Пользовательский хук при логауте (когда refresh невозможен) */
  onAuthFailed?: () => void | Promise<void>;
  /** Таймаут по умолчанию */
  timeoutMs?: number;
};

export class HttpClient {
  public readonly axios: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<() => void> = [];

  constructor(private readonly opts: HttpClientOptions) {
    this.axios = axios.create({
      baseURL: opts.baseURL,
      timeout: opts.timeoutMs ?? 30000,
    });

    // Request: подставляем accessToken
    this.axios.interceptors.request.use((config) => {
      const tokens = this.opts.tokenStorage.get();
      if (tokens?.accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    });

    // Response: общая обработка ошибок + refresh 401
    this.axios.interceptors.response.use(
      (r) => r,
      async (error: AxiosError) => {
        const status = error.response?.status;

        // Если нет refresh-функции — пробрасываем как ApiError
        if (status !== 401 || !this.opts.refreshFn) {
          throw this.toApiError(error);
        }

        const original = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (original._retry) {
          // уже пробовали обновить — выходим
          await this.opts.onAuthFailed?.();
          throw this.toApiError(error);
        }

        // очередь ожидания refresh, чтобы не дублировать запросы
        if (this.isRefreshing) {
          await new Promise<void>((resolve) => this.refreshQueue.push(resolve));
          // после refresh повторяем запрос
          original._retry = true;
          return this.axios.request(original);
        }

        try {
          this.isRefreshing = true;
          const tokens = this.opts.tokenStorage.get();
          if (!tokens?.refreshToken) {
            // нет refreshToken — завершаем с ошибкой
            await this.opts.onAuthFailed?.();
            throw this.toApiError(error);
          }

          const newTokens = await this.opts.refreshFn(tokens.refreshToken);
          this.opts.tokenStorage.set(newTokens);
          // освобождаем очередь
          this.refreshQueue.forEach((resolve) => resolve());
          this.refreshQueue = [];

          // повтор запроса
          original._retry = true;
          return this.axios.request(original);
        } catch (e) {
          await this.opts.onAuthFailed?.();
          throw this.toApiError(error);
        } finally {
          this.isRefreshing = false;
        }
      },
    );
  }

  private toApiError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = (data as any)?.message || error.message || 'API Error';
    return new ApiError(message, status, data);
  }
}
