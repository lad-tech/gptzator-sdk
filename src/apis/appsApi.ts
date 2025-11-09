import { GptzatorClient } from '../client';
import {
  TApp,
  TAppsDTO,
  TOauthClient,
  TAppsMenu,
  TSettingsTemplate,
  TSettingsTemplateDTO,
  TTagsDTO,
} from '../types/apps';
import {apiCall} from "../utils/apiCall";
import qs from 'qs';

/**
 * Класс для работы с API приложений
 */
export class AppsApi {
  constructor(private readonly client: GptzatorClient) {}

  /**
   * Получение списка приложений с фильтром и пагинацией
   * @param tag поиск по тэгу
   * @param author поиск по автору
   * @param page Номер страницы
   * @param search Поисковый запрос
   * @param limit Количество элементов на странице
   * @throws {ApiError} Когда запрос не удался
   */
  async getApps(params: {
    tag?: string;
    search?: string;
    page: number;
    author?: string;
    limit?: number;
  }): Promise<TAppsDTO> {
    return apiCall("AppsApi.getApps", async () => {
      const query: any = { name: { contains: params.search } };
      if (params.tag) query.tags = { equals: params.tag };
      if (params.author) query.author = { equals: params.author };

      const { data } = await this.client.http.get<TAppsDTO>('/apps', {
        params: { ...query, limit: params.limit },
      });

      return data;
    });

  }

  /**
   * Создание нового приложения
   * @param author Автор приложения
   * @param name Название приложения
   * @returns {Promise<TApp>}
   * @throws {ApiError}
   */
  async createApp(author: string, name = 'Новый навык'): Promise<TApp> {
    return apiCall("AppsApi.createApp", async () => {
      const { data } = await this.client.http.post<{ doc: TApp; message: string }>('/apps?depth=0', {
        author,
        name,
      });
      return data.doc;
    });
  }

  /**
   * Обновление приложения
   * @param id ID приложения
   * @param data Данные для обновления
   * @returns {Promise<TApp>}
   * @throws {ApiError}
   */
  async updateApp(id: string, data: any): Promise<TApp> {
    return apiCall("AppsApi.updateApp", async () => {
      const response = await this.client.http.patch<TApp>(`/apps/${id}?depth=0`, data);
      return response.data;
    });
  }

  /**
   * Удаление приложения
   * @param id ID приложения
   * @returns {Promise<TAppsDTO>}
   * @throws {ApiError}
   */
  async deleteApp(id: string): Promise<TAppsDTO> {
    return apiCall("AppsApi.deleteApp", async () => {
      const stringified = qs.stringify({ depth: 0, where: { id: { equals: id } } }, { addQueryPrefix: true });
      const { data } = await this.client.http.delete<TAppsDTO>(`/apps${stringified}`);
      return data;
    });
  }

  /**
   * Получение приложения по ID
   * @param id ID приложения
   * @returns {Promise<TApp>}
   * @throws {ApiError}
   */
  async getAppById(id: string): Promise<TApp> {
    return apiCall("AppsApi.getAppById", async () => {
      const { data } = await this.client.http.get<TApp>(`/apps/${id}?depth=0`);
      return data;
    });
  }

  /**
   * Получение OAuth клиентов для приложения
   * @param redirectUri URI для редиректа
   * @returns {Promise<TOauthClient[]>}
   * @throws {ApiError}
   */
  async getOauthClients(redirectUri: string): Promise<TOauthClient[]> {
    return apiCall("AppsApi.getOauthClients", async () => {
      const { data } = await this.client.http.get<{ clients: TOauthClient[] }>(`/oauth_clients/oauth/clients?redirectUri=${encodeURIComponent(redirectUri)}`);
      return data.clients;
    });
  }

  /**
   * Логаут OAuth клиента
   * @param clientId ID клиента
   * @returns {Promise<void>}
   * @throws {ApiError}
   */
  async logoutOauthClient(clientId: string): Promise<void> {
    return apiCall("AppsApi.logoutOauthClient", async () => {
      await this.client.http.post(`/oauth_clients/oauth/clients/${clientId}/logout`);
    });
  }

  /**
   * Получение меню приложений
   * @returns {Promise<TAppsMenu[]>}
   * @throws {ApiError}
   */
  async getAppsMenu(): Promise<TAppsMenu[]> {
    return apiCall("AppsApi.getAppsMenu", async () => {
      const { data } = await this.client.http.get<{ menu: TAppsMenu[] }>(`/apps_menu/tree`);
      return data.menu;
    });
  }

  /**
   * Получение избранных приложений
   * @returns {Promise<TApp[]>}
   * @throws {ApiError}
   */
  async getFavouriteApps(): Promise<TApp[]> {
    return apiCall("AppsApi.getFavouriteApps", async () => {
      const { data } = await this.client.http.get<TApp[]>(`/apps/favourites?depth=0`);
      return data;
    });
  }

  /**
   * Обновление статуса избранного приложения
   * @param id ID приложения
   * @param isFavourite Статус избранного
   * @returns {Promise<void>}
   * @throws {ApiError}
   */
  async updateIsFavourite(id: string, isFavourite: boolean): Promise<void> {
    return apiCall("AppsApi.updateIsFavourite", async () => {
      if (isFavourite) {
        await this.client.http.post(`/users/favourites`, { id });
      } else {
        await this.client.http.delete(`/users/favourites/${id}`);
      }
    });
  }

  /**
   * Получение тегов приложений
   * @param limit Максимум тегов (по умолчанию 50)
   * @returns {Promise<TTagsDTO>}
   * @throws {ApiError}
   */
  async getTags(limit = 50): Promise<TTagsDTO> {
    return apiCall("AppsApi.getTags", async () => {
      const stringified = qs.stringify({ limit, page: 1 }, { addQueryPrefix: true });
      const { data } = await this.client.http.get<TTagsDTO>(`/tags${stringified}`);
      return data;
    });
  }

  /**
   * Получение шаблонов настроек приложения
   * @param params Параметры: appId, search, page, limit
   * @returns {Promise<TSettingsTemplateDTO>}
   * @throws {ApiError}
   */
  async getSettingsTemplates(params: {
    appId: string;
    search?: string;
    page: number;
    limit?: number;
  }): Promise<TSettingsTemplateDTO> {
    return apiCall("AppsApi.getSettingsTemplates", async () => {
      const query: any = { app: { equals: params.appId } };
      if (params.search) query.name = { contains: params.search };

      const { data } = await this.client.http.get<TSettingsTemplateDTO>('/apps_settings', {
        params: { ...query, limit: params.limit },
      });
      return data;
    });
  }

  /**
   * Активация шаблона настроек
   * @param id ID шаблона
   * @returns {Promise<TSettingsTemplate>}
   * @throws {ApiError}
   */
  async activateTemplate(id: string): Promise<TSettingsTemplate> {
    return apiCall("AppsApi.activateTemplate", async () => {
      const { data } = await this.client.http.post<TSettingsTemplate>(`/apps_settings/${id}/activate`);
      return data;
    });
  }

  /**
   * Создание шаблона настроек
   * @param data Данные шаблона
   * @returns {Promise<TSettingsTemplate>}
   * @throws {ApiError}
   */
  async createSettingsTemplate(data: any): Promise<TSettingsTemplate> {
    return apiCall("AppsApi.createSettingsTemplate", async () => {
      const { data: template } = await this.client.http.post<TSettingsTemplate>(`/apps_settings`, data);
      return template;
    });
  }

  /**
   * Обновление шаблона настроек
   * @param id ID шаблона
   * @param data Данные для обновления
   * @returns {Promise<TSettingsTemplate>}
   * @throws {ApiError}
   */
  async updateSettingsTemplate(id: string, data: any): Promise<TSettingsTemplate> {
    return apiCall("AppsApi.updateSettingsTemplate", async () => {
      const { data: template } = await this.client.http.patch<TSettingsTemplate>(`/apps_settings/${id}?depth=0`, data);
      return template;
    });
  }

  /**
   * Удаление шаблона настроек
   * @param id ID шаблона
   * @returns {Promise<void>}
   * @throws {ApiError}
   */
  async deleteSettingsTemplate(id: string): Promise<void> {
    return apiCall("AppsApi.deleteSettingsTemplate", async () => {
      const stringified = qs.stringify({ depth: 0, where: { id: { equals: id } } }, { addQueryPrefix: true });
      await this.client.http.delete(`/apps_settings${stringified}`);
    });
  }
}
