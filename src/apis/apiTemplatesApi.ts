import { GptzatorClient } from '../client';
import { TApiTemplate, TApiTemplatesDTO } from '../types/apiTemplates';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с API-шаблонами
 */
export class ApiTemplatesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка API-шаблонов
     * @param search Поисковая строка
     * @param page Номер страницы
     * @param limit Количество элементов на странице
     * @returns {Promise<TApiTemplatesDTO>} Коллекция API-шаблонов
     * @throws {ApiError}
     */
    async getApiTemplates(params: {
        search?: string;
        page: number;
        limit?: number;
    }): Promise<TApiTemplatesDTO> {
        return apiCall("ApiTemplatesApi.getApiTemplates", async () => {
            const { data } = await this.client.http.get<TApiTemplatesDTO>(`/apps_steps_api_templates`, {
                params: {
                    name: { contains: params.search },
                    page: params.page,
                    limit: params.limit,
                },
            });
            return data;
        });
    }

    /**
     * Получение API-шаблона по ID
     * @param id ID шаблона
     * @returns {Promise<TApiTemplate>} API-шаблон
     * @throws {ApiError}
     */
    async getApiTemplate(id: string): Promise<TApiTemplate> {
        return apiCall("ApiTemplatesApi.getApiTemplate", async () => {
            const { data } = await this.client.http.get<TApiTemplate>(`/apps_steps_api_templates/${id}`);
            return data;
        });
    }
}
