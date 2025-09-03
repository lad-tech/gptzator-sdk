export { TCollection } from '../shared/types';

/**
 * Параметры API-шаблона
 */
export type TTemplateParams = {
    name: string;
    id: string;
    blockName: string;
    blockType: 'text' | 'textarea' | 'select';
    options?: { label: string; value: string }[];
};

/**
 * API-шаблон
 */
export type TApiTemplate = {
    author?: string;
    id: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    method: string;
    url: string;
    headers?: { name: string; value: string; id: string }[];
    params?: TTemplateParams[];
};

/**
 * Коллекция API-шаблонов
 */
// @ts-ignore
export type TApiTemplatesDTO = TCollection<TApiTemplate>;
