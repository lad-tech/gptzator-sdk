import { GptzatorClient } from '../client';
import {
  TUser,
  TOrganization,
  TUserAvatar,
  TDefaultModel,
  TDefaultThreadModel,
  TUserOauthClient,
} from '../types/user';
import qs from 'qs';
import {apiCall} from "../utils/apiCall";
import {TWorkspace} from "../types/workspaces";

/**
 * API-класс для работы с пользователями.
 *
 * Содержит методы для регистрации, авторизации, получения и обновления данных пользователя.
 */
export class UserApi {
  constructor(private readonly client: GptzatorClient) {}

  /**
   * Получить текущего пользователя.
   *
   * @returns {Promise<TUser>} Объект пользователя
   * @throws {ApiError}
   */
  async getUser(): Promise<TUser> {
    return apiCall("UserApi.getUser", async () => {
      const { data } = await this.client.http.get<{ user: TUser }>('/users/me');
      return data.user;
    });

  }

  /**
   * Смена пароля пользователя.
   *
   * @param oldPassword Старый пароль
   * @param newPassword Новый пароль
   * @returns {Promise<any>} Результат операции
   * @throws {ApiError}
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return apiCall("UserApi.changePassword", async () => {
      const { data } = await this.client.http.post('/users/me/change-password', {
        oldPassword,
        newPassword,
      });
      return data;
    });
  }

  /**
   * Отправка запроса на восстановление пароля.
   *
   * @param email Электронная почта пользователя
   * @returns {Promise<any>} Результат операции
   * @throws {ApiError}
   */
  async forgotPassword(email: string): Promise<any> {
    return apiCall("UserApi.forgotPassword", async () => {
      const { data } = await this.client.http.post('/users/forgot-password', { email });
      return data;
    });
  }

  /**
   * Сброс пароля по токену.
   *
   * @param token Токен восстановления пароля
   * @param password Новый пароль
   * @returns {Promise<TUser>} Результат операции
   * @throws {ApiError}
   */
  async resetPassword(token: string, password: string): Promise<TUser> {
    return apiCall("UserApi.resetPassword", async () => {
      const { data } = await this.client.http.post('/users/reset-password', { token, password });
      return data;
    });

  }

  /**
   * Логин пользователя.
   *
   * @param email Электронная почта
   * @param password Пароль
   * @returns {Promise<{user: TUser, token: string}>} Объект пользователя
   * @throws {ApiError}
   */
  async loginUser(email: string, password: string): Promise<{ user: TUser, token: string, refreshToken?: string }> {
    return apiCall("UserApi.loginUser", async () => {
      const { data } = await this.client.http.post<{ user: TUser, token: string, refreshToken?: string }>('/users/login', {
        email,
        password,
      });
      if (!data?.token) throw new Error("Login failed: token not returned");

      this.client.setTokens({
        accessToken: data.token,
        ...(data.refreshToken ? { refreshToken: data.refreshToken } : {}),
      });

      return {user: data.user, token: data.token};
    });
  }

  /**
   * Обновление модели потока по умолчанию для пользователя.
   *
   * @param userId ID пользователя
   * @param modelId ID модели чата
   * @returns {Promise<TUser>} Объект пользователя с обновлённой моделью
   * @throws {ApiError}
   */
  async updateDefaultThreadModel(userId: string, modelId: string): Promise<TUser> {
    return apiCall("UserApi.updateDefaultThreadModel", async () => {
      const { data } = await this.client.http.patch<{ doc: TUser }>(`/users/${userId}`, {
        defaultThreadModel: modelId,
      });
      return data.doc;
    });
  }

  /**
   * Установить, что пользователь прошёл страницу онбординга.
   *
   * @param userId ID пользователя
   * @param pageName Название страницы онбординга
   * @returns {Promise<TUser>} Объект пользователя
   * @throws {ApiError}
   */
  async setOnboarded(userId: string, pageName: string): Promise<TUser> {
    return apiCall("UserApi.setOnboarded", async () => {
      const { data } = await this.client.http.patch<{ user: TUser }>(`/users/${userId}`, {
        onboarded: { [pageName]: true },
      });
      return data.user;
    });
  }

  /**
   * Регистрация нового пользователя.
   *
   * @param params Параметры регистрации
   * @param params.email Электронная почта
   * @param params.password Пароль
   * @param params.policy Согласие с политикой
   * @param params.phone Телефон
   * @param params.promoCode Промокод (опционально)
   * @param params.organizationInviteToken Токен приглашения в организацию (опционально)
   * @returns {Promise<{ user: TUser, token: string }>} Объект пользователя
   * @throws {ApiError}
   */
  async signupUser(params: {
    email: string;
    password: string;
    policy: boolean;
    phone: string;
    promoCode?: string;
    organizationInviteToken?: string;
  }): Promise<{ user: TUser, token: string, refreshToken?: string }> {
    return apiCall("UserApi.signupUser", async () => {
      const { data } = await this.client.http.post<{ user: TUser, token: string, refreshToken?: string }>('/users/register', params);

      if (!data?.token) throw new Error("Login failed: token not returned");

      this.client.setTokens({
        accessToken: data.token,
        ...(data.refreshToken ? { refreshToken: data.refreshToken } : {}),
      });

      return {user: data.user, token: data.token};
    });
  }

  /**
   * Регистрация демо-пользователя.
   *
   * @returns {Promise<TUser>} Объект демо-пользователя
   * @throws {ApiError}
   */
  async signupDemoUser(): Promise<TUser> {
    return apiCall("UserApi.signupDemoUser", async () => {
      const { data } = await this.client.http.post<{ user: TUser }>('/users/register-demo');
      return data.user;
    });
  }

  /**
   * Выход пользователя из системы.
   *
   * @returns {Promise<void>}
   * @throws {ApiError}
   */
  async logoutUser(): Promise<void> {
    return apiCall("UserApi.logoutUser", async () => {
      try {
        await this.client.http.post('/users/logout')
      } finally {
        this.client.setTokens(null);
      };
    });
  }

  /**
   * Загрузка аватара пользователя.
   *
   * @param formData FormData с файлом аватара
   * @returns {Promise<TUserAvatar>} Загруженный аватар
   * @throws {ApiError}
   */
  async uploadAvatar(formData: FormData): Promise<TUserAvatar> {
    return apiCall("UserApi.uploadAvatar", async () => {
      const { data } = await this.client.http.post<{ doc: TUserAvatar }>('/users_avatars', formData);
      return data.doc;
    });
  }

  /**
   * Удаление аватара пользователя.
   *
   * @param fileId ID файла аватара
   * @returns {Promise<any>} Результат удаления
   * @throws {ApiError}
   */
  async deleteAvatar(fileId: string): Promise<any> {
    return apiCall("UserApi.deleteAvatar", async () => {
      const stringifiedQuery = qs.stringify(
              { where: { id: { equals: fileId } } },
              { addQueryPrefix: true },
      );
      const { data } = await this.client.http.delete(`/users_avatars${stringifiedQuery}`);
      return data;
    });
  }

  /**
   * Обновление имени и фамилии пользователя.
   *
   * @param userId ID пользователя
   * @param firstName Новое имя
   * @param lastName Новая фамилия
   * @returns {Promise<TUser>} Результат обновления
   * @throws {ApiError}
   */
  async updateFirstAndMiddleName(
    userId: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
    return apiCall("UserApi.updateFirstAndMiddleName", async () => {
      const { data } = await this.client.http.patch<{ doc: TUser }>(`/users/${userId}`, { firstName, lastName });
      return data.doc;
    });

  }

  /**
   * Установка локали пользователя.
   *
   * @param locale Код локали (например, "ru")
   * @returns {Promise<void>}
   */
  async setLocale(locale: string): Promise<void> {
    return apiCall("UserApi.setLocale", async () => {
      await this.client.http.post('/payload-preferences/locale', { value: locale });
    });

  }
}
