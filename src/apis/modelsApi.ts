import { GptzatorClient } from '../client';
import {
    TModel,
    TLlmModel,
    TEmbeddingModel,
    TModelsDTO,
    TLlmModelsDTO,
    TEmbeddingModelDTO,
} from '../types/models';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с моделями
 */
export class ModelsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка моделей
     * @returns {Promise<TModel[]>} Список моделей
     * @throws {ApiError}
     */
    async getModels(): Promise<TModel[]> {
        return apiCall("ModelsApi.getModels", async () => {
            const { data } = await this.client.http.get<TModelsDTO>(`/models`, {
                params: { limit: 20 },
            });
            return data.docs;
        });
    }

    /**
     * Получение списка активных моделей
     * @returns Список активных моделей
     * @throws {ApiError}
     */
    async getActiveModels(): Promise<TModel[]> {
        return apiCall("ModelsApi.getActiveModels", async () => {
            const { data } = await this.client.http.get<TModelsDTO>(`/models`, {
                params: {
                    limit: 20,
                    where: { active: { equals: true } },
                },
            });
            return data.docs;
        });
    }

    /**
     * Получение списка LLM моделей
     * @returns {Promise<TLlmModel[]>} Список LLM моделей
     * @throws {ApiError}
     */
    async getLlmModels(): Promise<TLlmModel[]> {
        return apiCall("ModelsApi.getLlmModels", async () => {
            const { data } = await this.client.http.get<TLlmModelsDTO>(`/llm_models`, {
                params: { limit: 20 },
            });
            return data.docs;
        });

    }

    /**
     * Получение embedding-моделей
     * @returns {Promise<TEmbeddingModel[]>} Список embedding-моделей
     * @throws {ApiError}
     */
    async getEmbeddingModels(): Promise<TEmbeddingModel[]> {
        return apiCall("ModelsApi.getEmbeddingModels", async () => {
            const { data } = await this.client.http.get<TEmbeddingModelDTO>(
                    `/embedding_models`
            );
            return data.docs;
        });
    }
}
