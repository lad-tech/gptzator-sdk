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

/**
 * Класс для работы с API приложений
 */
export class AppsApi {
  constructor(private readonly client: GptzatorClient) {}

  /**
   * Получение списка приложений с фильтром и пагинацией
   * @param params Параметры фильтрации и пагинации
   */
  async getApps(params: {
    tag?: string;
    search?: string;
    page: number;
    author?: string;
    appsPerPage?: number;
  }): Promise<TAppsDTO> {
    const query: any = { name: { contains: params.search } };
    if (params.tag) query.tags = { equals: params.tag };
    if (params.author) query.author = { equals: params.author };

    const { data } = await this.client.http.get<TAppsDTO>('/apps', {
      params: { ...query, limit: params.appsPerPage },
    });

    return data;
  }

  /**
   * Создание нового приложения
   * @param author Автор приложения
   * @param name Название приложения
   */
  async createApp(author: string, name = 'Новый навык'): Promise<TApp> {
    const { data } = await this.client.http.post<{ doc: TApp; message: string }>('/apps?depth=0', {
      author,
      name,
    });
    return data.doc;
  }

  /**
   * Обновление приложения
   * @param id ID приложения
   * @param data Данные для обновления
   */
  async updateApp(id: string, data: any): Promise<TApp> {
    const response = await this.client.http.patch<TApp>(`/apps/${id}?depth=0`, data);
    return response.data;
  }

  /**
   * Удаление приложения
   * @param id ID приложения
   */
  async deleteApp(id: string): Promise<TAppsDTO> {
    const response = await this.client.http.delete<TAppsDTO>('/apps', {
      params: { where: { id: { equals: id } } },
    });
    return response.data;
  }

  /**
   * Получение приложения по ID
   * @param id ID приложения
   */
  async getAppById(id: string): Promise<TApp> {
    const { data } = await this.client.http.get<TApp>(`/apps/${id}?depth=0`);
    return data;
  }

  /**
   * Получение OAuth клиентов для приложения
   * @param redirectUri URI для редиректа
   */
  async getOauthClients(redirectUri: string): Promise<TOauthClient[]> {
    const { data } = await this.client.http.get<{ clients: TOauthClient[] }>(
      `/oauth_clients/oauth/clients?redirectUri=${redirectUri}`,
    );
    return data.clients;
  }

  /**
   * Логаут OAuth клиента
   * @param clientId ID клиента
   */
  async logoutOauthClient(clientId: string): Promise<void> {
    await this.client.http.post(`/oauth_clients/oauth/clients/${clientId}/logout`);
  }

  /**
   * Получение меню приложений
   */
  async getAppsMenu(): Promise<TAppsMenu[]> {
    const { data } = await this.client.http.get<{ menu: TAppsMenu[] }>('/apps_menu/tree');
    return data.menu;
  }

  /**
   * Получение избранных приложений
   */
  async getFavouriteApps(): Promise<TApp[]> {
    const { data } = await this.client.http.get<TApp[]>('/apps/favourites?depth=0');
    return data;
  }

  /**
   * Обновление статуса избранного приложения
   * @param id ID приложения
   * @param isFavourite Статус избранного
   */
  async updateIsFavourite(id: string, isFavourite: boolean): Promise<void> {
    if (isFavourite) {
      await this.client.http.post('/users/favourites', { id });
    } else {
      await this.client.http.delete(`/users/favourites/${id}`);
    }
  }

  /**
   * Получение тегов приложений
   */
  async getTags(): Promise<TTagsDTO> {
    const { data } = await this.client.http.get<TTagsDTO>('/tags', {
      params: { limit: 50, page: 1 },
    });
    return data;
  }

  /**
   * Получение шаблонов настроек приложения
   * @param appId ID приложения
   * @param search Поисковая строка
   * @param page Номер страницы
   * @param templatesPerPage Количество шаблонов на странице
   */
  async getSettingsTemplates(params: {
    appId: string;
    search?: string;
    page: number;
    templatesPerPage?: number;
  }): Promise<TSettingsTemplateDTO> {
    const query: any = { app: { equals: params.appId } };
    if (params.search) query.name = { contains: params.search };

    const { data } = await this.client.http.get<TSettingsTemplateDTO>('/apps_settings', {
      params: { ...query, limit: params.templatesPerPage },
    });
    return data;
  }

  /**
   * Активация шаблона настроек
   * @param id ID шаблона
   */
  async activateTemplate(id: string): Promise<TSettingsTemplate> {
    const { data } = await this.client.http.post<TSettingsTemplate>(
      `/apps_settings/${id}/activate`,
    );
    return data;
  }

  /**
   * Создание шаблона настроек
   * @param data Данные для нового шаблона
   */
  async createSettingsTemplate(data: any): Promise<TSettingsTemplate> {
    const { data: template } = await this.client.http.post<TSettingsTemplate>(
      '/apps_settings',
      data,
    );
    return template;
  }

  /**
   * Обновление шаблона настроек
   * @param id ID шаблона
   * @param data Данные для обновления
   */
  async updateSettingsTemplate(id: string, data: any): Promise<TSettingsTemplate> {
    const { data: template } = await this.client.http.patch<TSettingsTemplate>(
      `/apps_settings/${id}?depth=0`,
      data,
    );
    return template;
  }

  /**
   * Удаление шаблона настроек
   * @param id ID шаблона
   */
  async deleteSettingsTemplate(id: string): Promise<void> {
    await this.client.http.delete(`/apps_settings`, {
      params: { where: { id: { equals: id } } },
    });
  }
}
