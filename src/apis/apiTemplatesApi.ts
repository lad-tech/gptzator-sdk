import { GptzatorClient } from '../client';
import { TApiTemplate, TApiTemplatesDTO } from '../types/apiTemplates';

/**
 * Класс для работы с API-шаблонами
 */
export class ApiTemplatesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка API-шаблонов
     * @param search Поисковая строка
     * @param page Номер страницы
     * @param vaultsPerPage Количество элементов на странице (по умолчанию `TEMPLATES_PER_PAGE`)
     * @returns Коллекция API-шаблонов
     */
    async getApiTemplates(params: {
        search?: string;
        page: number;
        vaultsPerPage?: number;
    }): Promise<TApiTemplatesDTO> {
        const { data } = await this.client.http.get<TApiTemplatesDTO>(`apps_steps_api_templates`, {
            params: {
                name: { contains: params.search },
                page: params.page,
                limit: params.vaultsPerPage,
            },
        });
        return data;
    }

    /**
     * Получение API-шаблона по ID
     * @param id ID шаблона
     * @returns API-шаблон
     */
    async getApiTemplate(id: string): Promise<TApiTemplate> {
        const { data } = await this.client.http.get<TApiTemplate>(`apps_steps_api_templates/${id}`);
        return data;
    }
}
