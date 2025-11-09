import { GptzatorClient } from "../client";
import {
    TThreadDTO,
    TThreadsDTO,
    TThreadsSearchParams,
    TMessagesDTO,
    TMessage,
    TGenerationTypeDTO,
} from "../types/threads";
import {apiCall} from "../utils/apiCall";
import qs from 'qs';

/**
 * API для работы с чатами (threads) и сообщениями.
 * Предоставляет методы для получения, создания, обновления и удаления потоков и сообщений.
 */
export class ThreadsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получить список тредов с пагинацией и поиском
     * @param params Параметры: search?, page
     * @returns {Promise<TThreadsDTO>}
     * @throws {ApiError}
     */
    async getThreads(params?: TThreadsSearchParams): Promise<TThreadsDTO> {
        return apiCall("ThreadsApi.getThreads", async () => {
            if (!params) {
                const { data } = await this.client.http.get<TThreadsDTO>(`/threads`);
                return data;
            }
            const { search, page } = params;
            const where = search ? { title: { contains: search } } : undefined;
            const stringified = qs.stringify({ ...(where ? { where } : {}), limit: 20, page }, { addQueryPrefix: true });
            const { data } = await this.client.http.get<TThreadsDTO>(`/threads${stringified}`);
            return data;
        });
    }

    /**
     * Получить поток по его идентификатору.
     *
     * @param {string} id - Уникальный идентификатор потока.
     * @returns {Promise<TThreadDTO>} Данные о потоке.
     * @throws {ApiError}
     */
    async getThreadById(id: string): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.getThreadById", async () => {
            const { data } = await this.client.http.get<TThreadDTO>(`/threads/${id}`);
            return data;
        });
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
     * @throws {ApiError}
     */
    async createThread(data: {
        id: string;
        title: string;
        vaultIds?: string[];
        fileIds?: string[];
    }): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.createThread", async () => {
            const { data: newThread } = await this.client.http.post<TThreadDTO>("/threads/create", data);
            return newThread
        });
    }

    /**
     * Удалить поток.
     *
     * @param {string} id - Идентификатор потока.
     * @returns {Promise<TThreadDTO>} Удалённый поток.
     * @throws {ApiError}
     */
    async deleteThread(id: string): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.deleteThread", async () => {
            const { data } = await this.client.http.delete<TThreadDTO>(`/threads/${id}`);
            return data;
        });
    }

    /**
     * Обновить список хранилищ (vaults), привязанных к потоку.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.id - Идентификатор потока.
     * @param {string[]} data.vaultIds - Список идентификаторов хранилищ.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     * @throws {ApiError}
     */
    async updateThreadVault(data: {
        id: string;
        vaultIds: string[];
    }): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.updateThreadVault", async () => {
            const { data: threadData } = await this.client.http.post<TThreadDTO>(
                    `/threads/${data.id}/set-context`,
                    { vaultIds: data.vaultIds }
            );
            return threadData;
        });
    }

    /**
     * Получить список сообщений в потоке.
     *
     * @param {Object} params - Параметры запроса.
     * @param {string} params.threadId - Идентификатор потока.
     * @param {number} [params.page=1] - Номер страницы.
     * @returns {Promise<TMessagesDTO>} Список сообщений.
     * @throws {ApiError}
     */
    async getMessages(params: {
        threadId: string;
        page?: number;
    }): Promise<TMessagesDTO> {
        return apiCall("ThreadsApi.getMessages", async () => {
            const { data } = await this.client.http.get<TMessagesDTO>("/threads_messages", { params });
            return data;
        });
    }

    /**
     * Получить список типов генерации.
     *
     * @returns {Promise<TGenerationTypeDTO>} Список доступных типов генерации.
     * @throws {ApiError}
     */
    async getGenerationTypes(): Promise<TGenerationTypeDTO> {
        return apiCall("ThreadsApi.getGenerationTypes", async () => {
            const { data } = await this.client.http.get<TGenerationTypeDTO>("/threads_generation_types");
            return data;
        });
    }

    /**
     * Обновить тип генерации для потока.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.typeId - Идентификатор типа генерации.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     * @throws {ApiError}
     */
    async updateGenerationType(data: {
        threadId: string;
        typeId: string;
    }): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.updateGenerationType", async () => {
            const { data: threadData } = await this.client.http.patch<TThreadDTO>(`/threads/${data.threadId}`, {
                generationType: data.typeId,
            });
            return threadData;
        });

    }

    /**
     * Обновить модель для потока.
     *
     * @param {Object} data - Данные для обновления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.modelId - Идентификатор модели.
     * @returns {Promise<TThreadDTO>} Обновлённый поток.
     * @throws {ApiError}
     */
    async updateThreadModel(data: {
        threadId: string;
        modelId: string;
    }): Promise<TThreadDTO> {
        return apiCall("ThreadsApi.updateThreadModel", async () => {
            const { data: threadData } = await this.client.http.patch<TThreadDTO>(`/threads/${data.threadId}`, {
                model: data.modelId,
            });
            return threadData;
        });

    }

    /**
     * Создать сообщение в потоке.
     *
     * @param {Object} data - Данные для создания сообщения.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.text - Текст сообщения.
     * @returns {Promise<TMessage>} Созданное сообщение.
     * @throws {ApiError}
     */
    async createMessage(data: {
        text: string;
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadsApi.createMessage", async () => {
            const { data: message } = await this.client.http.post<TMessage>(
                    `/threads/${data.threadId}/messages`,
                    { text: data.text }
            );
            return message;
        });

    }

    /**
     * Изменить сообщение в потоке.
     *
     * @param {Object} data - Данные для изменения сообщения.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @param {string} data.content - Новый контент сообщения.
     * @returns {Promise<TMessage>} Обновлённое сообщение.
     * @throws {ApiError}
     */
    async editMessage(data: {
        content: string;
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadsApi.editMessage", async () => {
            const { data: message } = await this.client.http.patch<TMessage>(
                    `/threads/${data.threadId}/messages/${data.messageId}`,
                    { content: data.content }
            );
            return message;
        });

    }

    /**
     * Удалить сообщение из потока.
     *
     * @param {Object} data - Данные для удаления.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @returns {Promise<TMessage>} Удалённое сообщение.
     * @throws {ApiError}
     */
    async deleteMessage(data: {
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadsApi.deleteMessage", async () => {
            const { data: message } = await this.client.http.delete<TMessage>(
                    `/threads/${data.threadId}/messages/${data.messageId}`
            );
            return message;
        });

    }

    /**
     * Перегенерировать сообщение.
     *
     * @param {Object} data - Данные для перегенерации.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string} data.messageId - Идентификатор сообщения.
     * @returns {Promise<TMessage>} Новая версия сообщения.
     * @throws {ApiError}
     */
    async regenerateMessage(data: {
        messageId: string;
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadsApi.regenerateMessage", async () => {
            const { data: message } = await this.client.http.post<TMessage>(
                    `/threads/${data.threadId}/messages/${data.messageId}/regenerate`
            );
            return message;
        });

    }

    /**
     * Прикрепить файлы к потоку.
     *
     * @param {Object} data - Данные для прикрепления файлов.
     * @param {string} data.threadId - Идентификатор потока.
     * @param {string[]} data.fileIds - Список идентификаторов файлов.
     * @returns {Promise<TMessage>} Сообщение с прикреплёнными файлами.
     * @throws {ApiError}
     */
    async attachFilesToThread(data: {
        threadId: string;
        fileIds: string[];
    }): Promise<TMessage> {
        return apiCall("ThreadsApi.attachFilesToThread", async () => {
            const { data: message } = await this.client.http.post<TMessage>(
                    `/threads/${data.threadId}/files/attach`,
                    { fileIds: data.fileIds }
            );
            return message;
        });

    }
}
