import { GptzatorClient } from '../client';
import {
    TAssistant,
    TAssistantsDTO,
    TCreateAssistantRequest,
    TUpdateAssistantContextRequest
} from '../types/assistants';

/**
 * Класс для работы с API ассистентов
 */
export class AssistantsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка ассистентов
     * @param search Поисковая строка
     * @returns Promise<{ assistants: TAssistant[] }> Список ассистентов
     */
    async getAssistants(search?: string): Promise<{ assistants: TAssistant[] }> {
        const { data } = await this.client.http.get<{ assistants: TAssistant[] }>('/assistant/assistants', {
            params: { search }
        });
        return data;
    }

    /**
     * Получение ассистента по ID
     * @param id ID ассистента
     * @returns Promise<TAssistant> Ассистент
     */
    async getAssistantById(id: string): Promise<TAssistant> {
        const { data } = await this.client.http.get<TAssistant>(`/assistant/assistants/${id}`);
        return data;
    }

    /**
     * Создание ассистента
     * @param data Данные для создания ассистента
     * @returns Созданный ассистент
     */
    async createAssistant(data: TCreateAssistantRequest): Promise<TAssistant> {
        const response = await this.client.http.post<TAssistant>('/assistant/assistants', data);
        return response.data;
    }

    /**
     * Обновление ассистента
     * @param id ID ассистента
     * @param data Новые данные ассистента
     * @returns Обновленный ассистент
     */
    async updateAssistant(id: string, data: TCreateAssistantRequest): Promise<TAssistant> {
        const response = await this.client.http.patch<TAssistant>(`/assistant/assistants/${id}`, data);
        return response.data;
    }

    /**
     * Обновление контекста ассистента
     * @param id ID ассистента
     * @param data Данные для обновления контекста
     * @returns Ассистент с обновленным контекстом
     */
    async updateAssistantContext(id: string, data: TUpdateAssistantContextRequest): Promise<TAssistant> {
        const response = await this.client.http.patch<TAssistant>(`/assistant/assistants/${id}/context`, data);
        return response.data;
    }

    /**
     * Загрузка изображения ассистента
     * @param formData FormData с изображением
     * @returns Данные о загруженном изображении
     */
    async uploadAssistantImage(formData: FormData): Promise<any> {
        const response = await this.client.http.post('/assistant__images', formData);
        return response.data;
    }

    /**
     * Удаление ассистента
     * @param id ID ассистента
     * @returns Удаленный ассистент
     */
    async deleteAssistant(id: string): Promise<TAssistant> {
        const response = await this.client.http.delete<TAssistant>(`/assistant/assistants/${id}`);
        return response.data;
    }
}
