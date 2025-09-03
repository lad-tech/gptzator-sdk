import { GptzatorClient } from '../client';
import {
    TModel,
    TLlmModel,
    TEmbeddingModel,
    TModelsDTO,
    TLlmModelsDTO,
    TEmbeddingModelDTO,
} from '../types/models';

/**
 * Класс для работы с моделями
 */
export class ModelsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка моделей
     * @returns Список моделей
     */
    async getModels(): Promise<TModel[]> {
        const { data } = await this.client.http.get<TModelsDTO>(`models`, {
            params: { limit: 20 }, // MODELS_PER_PAGE
        });
        return data.docs;
    }

    /**
     * Получение списка активных моделей
     * @returns Список активных моделей
     */
    async getActiveModels(): Promise<TModel[]> {
        const { data } = await this.client.http.get<TModelsDTO>(`models`, {
            params: {
                limit: 20, // MODELS_PER_PAGE
                where: { active: { equals: true } },
            },
        });
        return data.docs;
    }

    /**
     * Получение списка LLM моделей
     * @returns Список LLM моделей
     */
    async getLlmModels(): Promise<TLlmModel[]> {
        const { data } = await this.client.http.get<TLlmModelsDTO>(`llm_models`, {
            params: { limit: 20 }, // LLM_MODELS_PER_PAGE
        });
        return data.docs;
    }

    /**
     * Получение списка моделей эмбеддингов
     * @returns Список моделей эмбеддингов
     */
    async getEmbeddingModels(): Promise<TEmbeddingModel[]> {
        const { data } = await this.client.http.get<TEmbeddingModelDTO>(
                `embedding_models`
        );
        return data.docs;
    }
}
