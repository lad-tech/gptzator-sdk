export { TCollection } from '../shared/types';

/**
 * DTO коллекции тредов ассистента
 */
// @ts-ignore
export type TThreadsAssistantDTO = TCollection<TThreadAssistantDTO>;

/**
 * DTO коллекции сообщений
 */
// @ts-ignore
export type TMessagesDTO = TCollection<TMessage>;

/**
 * DTO коллекции типов генерации
 */
// @ts-ignore
export type TGenerationTypeDTO = TCollection<TGenerationType>;

/**
 * Тред ассистента
 */
export type TThreadAssistantDTO = {
    id: string;
    name: string;
    author: string;
    assistant: { name: string; scope: 'hidden' | 'org' | 'public' | 'personal' };
    status: 'generating' | 'wait';
    title: string;
    type: 'workspace' | 'assistant';
    updatedAt: string;
    createdAt: string;
    latestError: string | null;
    workspaces: { id: string; sources: { all: [] } }[];
    scope: 'hidden' | 'org' | 'public' | 'personal';
    mode: { id: string };
};

/** Ответ при получении треда по ID */
export type IGetThreadByIdResponse = TThreadAssistantDTO;
/** Запрос — ID треда */
export type IGetThreadByIdRequest = string;

/** Ответ при получении сообщений */
export type IGetMessagesResponse = TMessagesDTO;
/** Параметры поиска сообщений */
export type TMessagesSearchParams = { threadId: string; page?: number, limit?: number };

/**
 * Элемент варианта ответа в сообщении
 */
export type TMessageChoicesItem = {
    id: string;
    type: string;
    content: string;
    annotations?: Record<string, string>;
};

/**
 * Сообщение
 */
export type TMessage =
        | {
    id: string;
    choices: TMessageChoicesItem[];
    type: 'gpt' | 'user';
    userAvatar?: string;
    meta: { price: number };
}
        | {
    id: string;
    choices: TMessageChoicesItem[];
    file: { originalFilename: string; filesize: number; mimeType: string };
    type: 'userTextFile';
    userAvatar?: string;
    meta: { price: number };
};

/**
 * Контекст треда
 */
export type TThreadContext = {
    id: string;
    title: string;
    value: string;
};

/**
 * Тип генерации
 */
export type TGenerationType = {
    id: string;
    type: string;
    name: string;
};

/**
 * Ассистентский тред (базовая сущность)
 */
export type TThreadAssistant = {
    id: string;
    isGenerating: boolean;
    title: string;
    error?: string | null;
    aiName?: string;
    generationType?: TGenerationType;
    contexts?: TThreadContext[];
};

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
 * Хранилище (Vault)
 */
export type TVault = {
    id: string;
    name: string;
    description?: string;
    llm_instructions?: string;
    token?: string;
    data_title?: string;
    valueTitle?: string;
    createdAt?: string;
    updatedAt?: string;
    organization?: unknown;
    instructions?: string;
    logo?: string;
};
