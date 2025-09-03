export { TCollection } from '../shared/types';

/**
 * Модель
 */
export type TModel = {
    id: string;
    name: string;
    codeId: string;
    vendor: string;
    description?: string;
    active?: boolean;
};

/**
 * Модель LLM
 */
export type TLlmModel = {
    id: string;
    name: string;
    code: string;
};

/**
 * Модель для векторных эмбеддингов
 */
export type TEmbeddingModel = {
    id: string;
    name: string;
    description?: string;
    code: string;
    isActive?: boolean;
    model: string;
    price: number;
};

/**
 * DTO моделей
 */
// @ts-ignore
export type TModelsDTO = TCollection<TModel>;

/**
 * DTO LLM моделей
 */
// @ts-ignore
export type TLlmModelsDTO = TCollection<TLlmModel>;

/**
 * DTO моделей эмбеддингов
 */
// @ts-ignore
export type TEmbeddingModelDTO = TCollection<TEmbeddingModel>;
