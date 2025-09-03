import { HttpClient } from './http/HttpClient';
import { InMemoryTokenStorage, LocalStorageTokenStorage } from './auth/tokenStorage';
import type { TokenStorage, Tokens, RefreshFn } from './auth/types';
import {UserApi, ApiTemplatesApi, AssistantsApi, FilesApi, AppsApi, ProjectsApi, ThreadsApi, ModelsApi, InvitesApi} from './apis'
import {SourcesApi} from "./apis/sourcesApi";
import {SubscribesApi} from "./apis/subscribesApi";
import {ThreadAssistantApi} from "./apis/threadAssistantApi";
import {VaultsApi} from "./apis/vaultsApi";
import {WorkspacesApi} from "./apis/workspacesApi";

export type GptzatorClientOptions = {
  baseURL?: string; // опционально
  tokenStorage?: TokenStorage; // по умолчанию InMemory
  refreshFn?: RefreshFn; // если есть refresh эндпоинт
  onAuthFailed?: () => void | Promise<void>;
  timeoutMs?: number;
};

const DEFAULT_BASE_URL = 'https://api.dev.gpt-zator.ladcloud.ru/api/';

export class GptzatorClient {
  /** Хранилище токенов (можно подменить на localStorage) */
  public readonly tokenStorage: TokenStorage;
  /** Низкоуровневый транспорт */
  public readonly http: HttpClient['axios'];

  // доменные API
  public readonly user: UserApi;
  public readonly apps: AppsApi;
  public readonly projects: ProjectsApi;
  public readonly threads: ThreadsApi;
  public readonly assistants: AssistantsApi;
  public readonly apiTemplates: ApiTemplatesApi;
  public readonly files: FilesApi;
  public readonly models: ModelsApi;
  public readonly invites: InvitesApi;
  public readonly sources: SourcesApi;
  public readonly subscribes: SubscribesApi;
  public readonly threadAssistant: ThreadAssistantApi;
  public readonly vaults: VaultsApi;
  public readonly workspaces: WorkspacesApi;

  constructor(opts: GptzatorClientOptions = {}) {
    this.tokenStorage = opts.tokenStorage ?? new InMemoryTokenStorage();

    const http = new HttpClient({
      baseURL: opts.baseURL ?? DEFAULT_BASE_URL,
      tokenStorage: this.tokenStorage,
      refreshFn: opts.refreshFn,
      onAuthFailed: opts.onAuthFailed,
      timeoutMs: opts.timeoutMs,
    });

    this.http = http.axios;

    // доменные клиенты
    this.user = new UserApi(this);
    this.apps = new AppsApi(this);
    this.projects = new ProjectsApi(this);
    this.threads = new ThreadsApi(this);
    this.assistants = new AssistantsApi(this);
    this.apiTemplates = new ApiTemplatesApi(this);
    this.files = new FilesApi(this);
    this.invites = new InvitesApi(this);
    this.models = new ModelsApi(this);
    this.sources = new SourcesApi(this);
    this.subscribes = new SubscribesApi(this);
    this.threadAssistant = new ThreadAssistantApi(this);
    this.vaults = new VaultsApi(this);
    this.workspaces = new WorkspacesApi(this);
  }

  /** Ручная установка/сброс токенов (например, после SSO) */
  setTokens(tokens: Tokens | null) {
    this.tokenStorage.set(tokens);
  }

  /** Текущие токены (если нужны снаружи) */
  getTokens(): Tokens | null {
    return this.tokenStorage.get();
  }
}
