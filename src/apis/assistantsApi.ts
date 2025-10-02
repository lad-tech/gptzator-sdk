import { GptzatorClient } from '../client';
import {
    TAssistant,
    TCreateAssistantRequest,
    TUpdateAssistantContextRequest
} from '../types/assistants';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с API ассистентов
 */
export class AssistantsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка ассистентов
     * @param search Поисковая строка
     * @returns Promise<{ assistants: TAssistant[] }> Список ассистентов
     * @throws {ApiError}
     */
    async getAssistants(search?: string): Promise<{ assistants: TAssistant[] }> {
        return apiCall("AssistantsApi.getAssistants", async () => {
            const { data } = await this.client.http.get<{ assistants: TAssistant[] }>('/assistant/assistants', {
                params: { search }
            });
            return data;
        });

    }

    /**
     * Получение ассистента по ID
     * @param id ID ассистента
     * @returns {Promise<TAssistant>} Ассистент
     * @throws {ApiError}
     */
    async getAssistantById(id: string): Promise<TAssistant> {
        return apiCall("AssistantsApi.getAssistantById", async () => {
            const { data } = await this.client.http.get<TAssistant>(`/assistant/assistants/${id}`);
            return data;
        });
    }

    /**
     * Создание ассистента
     * @param data Данные для создания ассистента
     * @returns {Promise<TAssistant>} Созданный ассистент
     * @throws {ApiError}
     */
    async createAssistant(data: TCreateAssistantRequest): Promise<TAssistant> {
        return apiCall("AssistantsApi.createAssistant", async () => {
            const response = await this.client.http.post<TAssistant>('/assistant/assistants', data);
            return response.data;
        });
    }

    /**
     * Обновление ассистента
     * @param id ID ассистента
     * @param data Новые данные ассистента
     * @returns {Promise<TAssistant>} Обновленный ассистент
     * @throws {ApiError}
     */
    async updateAssistant(id: string, data: TCreateAssistantRequest): Promise<TAssistant> {
        return apiCall("AssistantsApi.updateAssistant", async () => {
            const response = await this.client.http.patch<TAssistant>(`/assistant/assistants/${id}`, data);
            return response.data;
        });
    }

    /**
     * Обновление контекста ассистента
     * @param id ID ассистента
     * @param data Данные для обновления контекста
     * @returns {Promise<TAssistant>} Ассистент с обновленным контекстом
     * @throws {ApiError}
     */
    async updateAssistantContext(id: string, data: TUpdateAssistantContextRequest): Promise<TAssistant> {
        return apiCall("AssistantsApi.updateAssistantContext", async () => {
            const response = await this.client.http.patch<TAssistant>(`/assistant/assistants/${id}/context`, data);
            return response.data;
        });
    }

    /**
     * Загрузка изображения ассистента
     * @param formData FormData с изображением
     * @returns Данные о загруженном изображении
     * @throws {ApiError}
     */
    async uploadAssistantImage(formData: FormData): Promise<any> {
        return apiCall("AssistantsApi.uploadAssistantImage", async () => {
            const { data } = await this.client.http.post(`/assistant__images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        });
    }

    /**
     * Удаление ассистента
     * @param id ID ассистента
     * @returns {Promise<TAssistant>} Удаленный ассистент
     * @throws {ApiError}
     */
    async deleteAssistant(id: string): Promise<TAssistant> {
        return apiCall("AssistantsApi.deleteAssistant", async () => {
            const response = await this.client.http.delete<TAssistant>(`/assistant/assistants/${id}`);
            return response.data;
        });
    }
}
