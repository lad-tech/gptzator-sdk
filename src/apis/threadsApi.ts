// src/apis/ThreadsApi.ts
import { GptzatorClient } from "../client";
import {
    TThread,
    TThreadDTO,
    TThreadsDTO,
    TThreadsSearchParams,
    TMessagesDTO,
    TMessage,
    TGenerationTypeDTO,
} from "../types/threads";

/**
 * API для работы с чатами (threads) и сообщениями.
 * Предоставляет методы для получения, создания, обновления и удаления потоков и сообщений.
 */
export class ThreadsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получить список потоков (чатов).
     *
     * @param {TThreadsSearchParams} [params] - Параметры поиска и пагинации.
     * @param {string} [params.search] - Поисковая строка по названию.
     * @param {number} params.page - Номер страницы.
     * @returns {Promise<TThreadsDTO>} Список потоков с пагинацией.
     */
    async getThreads(params?: TThreadsSearchParams): Promise<TThreadsDTO> {
        const { data } = await this.client.http.get<TThreadsDTO>("threads", { params });
        return data;
    }

    /**
     * Получить поток по его идентификатору.
     *
     * @param {string} id - Уникальный идентификатор потока.
     * @returns {Promise<TThreadDTO>} Данные о потоке.
     */
    async getThreadById(id: string): Promise<TThreadDTO> {
        const { data } = await this.client.http.get<TThreadDTO>(`threads/${id}`);
        return data;
    }

    /**
     * Создать новый поток.
     *
     * @param {Object} data - Данные для создания потока.
     * @param {string} data.id - Идентификатор модели (modelId).
     * @param {string} data.title - Название потока.
     * @param {string[]} [data.vaultIds] - Идентификаторы привязанных хранилищ.
     * @param {string[]} [data.fileIds] - Идентификаторы файлов.
     * @returns {Promise<TThreadDTO>} Созданный поток.
     */
    async createThread(data: {
        id: string;
        title: string;
        vaultIds?: string[];
        fileIds?: string[];
    }): Promise<TThreadDTO> {
        const { data: newThread } = await this.client.http.post<TThreadDTO>("threads/create", data);
        return newThread
    }

    /**
     * Удалить поток.
     *
     * @param {string} id - Идентификатор потока.
     * @returns {Promise<TThreadDTO>} Удалённый поток.
     */
    async deleteThread(id: string): Promise<TThreadDTO> {
        const { data } = await this.client.http.delete<TThreadDTO>(`threads/${id}`);
        return data;
    }

    /**
     * Обновить список хранилищ (vaults), привязанных к потоку.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.id - Идентификатор потока.
     * @param {string[]} data.vaultIds - Список идентификаторов хранилищ.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     */
    async updateThreadVault(data: {
        id: string;
        vaultIds: string[];
    }): Promise<TThreadDTO> {
        const { data: threadData } = await this.client.http.post<TThreadDTO>(
                `threads/${data.id}/set-context`,
                { vaultIds: data.vaultIds }
        );
        return threadData;
    }

    /**
     * Получить список сообщений в потоке.
     *
     * @param {Object} params - Параметры запроса.
     * @param {string} params.threadId - Идентификатор потока.
     * @param {number} [params.page=1] - Номер страницы.
     * @returns {Promise<TMessagesDTO>} Список сообщений.
     */
    async getMessages(params: {
        threadId: string;
        page?: number;
    }): Promise<TMessagesDTO> {
        const { data } = await this.client.http.get<TMessagesDTO>("threads_messages", { params });
        return data;
    }

    /**
     * Получить список типов генерации.
     *
     * @returns {Promise<TGenerationTypeDTO>} Список доступных типов генерации.
     */
    async getGenerationTypes(): Promise<TGenerationTypeDTO> {
        const { data } = await this.client.http.get<TGenerationTypeDTO>("threads_generation_types");
        return data;
    }

    /**
     * Обновить тип генерации для потока.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.typeId - Идентификатор типа генерации.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     */
    async updateGenerationType(data: {
        threadId: string;
        typeId: string;
    }): Promise<TThreadDTO> {
        const { data: threadData } = await this.client.http.patch<TThreadDTO>(`threads/${data.threadId}`, {
            generationType: data.typeId,
        });
        return threadData;
    }

    /**
     * Обновить модель для потока.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.modelId - Идентификатор модели.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     */
    async updateThreadModel(data: {
        threadId: string;
        modelId: string;
    }): Promise<TThreadDTO> {
        const { data: threadData } = await this.client.http.patch<TThreadDTO>(`threads/${data.threadId}`, {
            model: data.modelId,
        });
        return threadData;
    }

    /**
     * Создать сообщение в потоке.
     *
     * @param {Object} data - Данные для создания сообщения.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.text - Текст сообщения.
     * @returns {Promise<TMessage>} Созданное сообщение.
     */
    async createMessage(data: {
        text: string;
        threadId: string;
    }): Promise<TMessage> {
        const { data: message } = await this.client.http.post<TMessage>(
                `threads/${data.threadId}/messages`,
                { text: data.text }
        );
        return message;
    }

    /**
     * Изменить сообщение в потоке.
     *
     * @param {Object} data - Данные для изменения сообщения.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @param {string} data.content - Новый контент сообщения.
     * @returns {Promise<TMessage>} Обновлённое сообщение.
     */
    async editMessage(data: {
        content: string;
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        const { data: message } = await this.client.http.patch<TMessage>(
                `threads/${data.threadId}/messages/${data.messageId}`,
                { content: data.content }
        );
        return message;
    }

    /**
     * Удалить сообщение из потока.
     *
     * @param {Object} data - Данные для удаления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @returns {Promise<TMessage>} Удалённое сообщение.
     */
    async deleteMessage(data: {
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        const { data: message } = await this.client.http.delete<TMessage>(
                `threads/${data.threadId}/messages/${data.messageId}`
        );
        return message;
    }

    /**
     * Перегенерировать сообщение.
     *
     * @param {Object} data - Данные для перегенерации.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @returns {Promise<TMessage>} Новая версия сообщения.
     */
    async regenerateMessage(data: {
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        const { data: message } = await this.client.http.post<TMessage>(
                `threads/${data.threadId}/messages/${data.messageId}/regenerate`
        );
        return message;
    }

    /**
     * Прикрепить файлы к потоку.
     *
     * @param {Object} data - Данные для прикрепления файлов.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string[]} data.fileIds - Список идентификаторов файлов.
     * @returns {Promise<TMessage>} Сообщение с прикреплёнными файлами.
     */
    async attachFilesToThread(data: {
        threadId: string;
        fileIds: string[];
    }): Promise<TMessage> {
        const { data: message } = await this.client.http.post<TMessage>(
                `threads/${data.threadId}/files/attach`,
                { fileIds: data.fileIds }
        );

        return message;
    }
}
