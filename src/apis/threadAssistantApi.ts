import { GptzatorClient } from '../client';
import {
    TThreadsAssistantDTO,
    TThreadAssistantDTO,
    IGetMessagesResponse,
    TMessagesSearchParams,
    TMessage,
} from '../types/threadAssistant';
import {apiCall} from "../utils/apiCall";
import {ApiError} from "../errors/ApiError";

/**
 * Класс для работы с тредами ассистента
 */
export class ThreadAssistantApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение тредов по workspaceId
     * @param id ID рабочего пространства
     * @param page Номер страницы
     * @param search Поисковый запрос
     * @returns {Promise<TThreadsAssistantDTO>} Коллекция тредов
     * @throws {ApiError}
     */
    async getThreadsByWorkspaceId(params: {
        id: string;
        page: number;
        search?: string;
    }): Promise<TThreadsAssistantDTO> {
        return apiCall("ThreadAssistantApi.getThreadsByWorkspaceId", async () => {
            const { data } = await this.client.http.get<TThreadsAssistantDTO>(
                    `assistant__threads`,
                    { params }
            );
            return data;
        });
    }

    /**
     * Получение тредов по assistantId
     * @param id ID ассистента
     * @param page Номер страницы
     * @param search Поисковый запрос
     * @returns {Promise<TThreadsAssistantDTO>} Коллекция тредов
     * @throws {ApiError}
     */
    async getThreadsByAssistantId(params: {
        id: string;
        page: number;
        search?: string;
    }): Promise<TThreadsAssistantDTO> {
        return apiCall("ThreadAssistantApi.getThreadsByAssistantId", async () => {
            const { data } = await this.client.http.get<TThreadsAssistantDTO>(
                    `assistant__threads`,
                    { params }
            );
            return data;
        });
    }

    /**
     * Создание треда в workspace
     * @param id ID рабочего пространства
     * @param title Заголовок треда
     * @returns {Promise<TThreadAssistantDTO>} Созданный тред
     * @throws {ApiError}
     */
    async createThreadByWorkspaceId(params: {
        id: string;
        title: string;
    }): Promise<TThreadAssistantDTO> {
        return apiCall("ThreadAssistantApi.createThreadByWorkspaceId", async () => {
            const { id, ...body } = params;
            const { data } = await this.client.http.post<TThreadAssistantDTO>(
                    `assistant/workspaces/${id}/threads?depth=0`,
                    body
            );
            return data;
        });
    }

    /**
     * Создание треда для ассистента
     * @param id ID ассистента
     * @param title Заголовок
     * @param modeId (опционально) ID режима
     * @returns {Promise<TThreadAssistantDTO>} Созданный тред
     * @throws {ApiError}
     */
    async createThreadByAssistantId(params: {
        id: string;
        title: string;
        modeId?: string;
    }): Promise<TThreadAssistantDTO> {
        return apiCall("ThreadAssistantApi.createThreadByAssistantId", async () => {
            const { id, ...body } = params;
            const { data } = await this.client.http.post<TThreadAssistantDTO>(
                    `/assistant/assistants/${id}/threads`,
                    body
            );
            return data;
        });
    }

    /**
     * Обновление треда ассистента
     * @param thread Обновлённый объект треда
     * @returns {Promise<TThreadAssistantDTO>} Обновлённый тред
     * @throws {ApiError}
     */
    async updateThreadAssistant(
            thread: TThreadAssistantDTO
    ): Promise<TThreadAssistantDTO> {
        return apiCall("ThreadAssistantApi.updateThreadAssistant", async () => {
            const { id, ...body } = thread;
            const { data } = await this.client.http.patch<TThreadAssistantDTO>(
                    `assistant__threads/${id}?depth=0`,
                    body
            );
            return data;
        });
    }

    /**
     * Получение треда по ID
     * @param id ID треда
     * @returns {Promise<TThreadAssistantDTO>} Тред
     * @throws {ApiError}
     */
    async getThreadAssistantById(id: string): Promise<TThreadAssistantDTO> {
        return apiCall("ThreadAssistantApi.getThreadAssistantById", async () => {
            const { data } = await this.client.http.get<TThreadAssistantDTO>(
                    `assistant__threads/${id}`
            );
            return data;
        });
    }

    /**
     * Получение сообщений ассистента
     * @param threadId ID треда
     * @param page Номер страницы
     * @returns {Promise<IGetMessagesResponse>} Сообщения
     * @throws {ApiError}
     */
    async getMessagesAssistant(
            params: TMessagesSearchParams
    ): Promise<IGetMessagesResponse> {
        return apiCall("ThreadAssistantApi.getMessagesAssistant", async () => {
            const { threadId, page = 1 } = params;
            const { data } = await this.client.http.get<IGetMessagesResponse>(
                    `assistant__thread_messages`,
                    { params: { thread: { equals: threadId }, page } }
            );
            return data;
        });
    }

    /**
     * Создание сообщения
     * @param text Текст сообщения
     * @param threadId ID треда
     * @returns {Promise<TMessage>} Созданное сообщение
     * @throws {ApiError}
     */
    async createMessageAssistant(params: {
        text: string;
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadAssistantApi.createMessageAssistant", async () => {
            const { threadId, text } = params;
            const { data } = await this.client.http.post<TMessage>(
                    `assistant/threads/${threadId}/messages`,
                    { text }
            );
            return data;
        });
    }

    /**
     * Редактирование сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @param content Новый текст
     * @returns {Promise<TMessage>} Обновлённое сообщение
     * @throws {ApiError}
     */
    async editMessageAssistant(params: {
        threadId: string;
        messageId: string;
        content: string;
    }): Promise<TMessage> {
        return apiCall("ThreadAssistantApi.editMessageAssistant", async () => {
            const { threadId, messageId, content } = params;
            const { data } = await this.client.http.patch<TMessage>(
                    `/assistant/threads/${threadId}/messages/${messageId}`,
                    { content }
            );
            return data;
        });
    }

    /**
     * Удаление сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @returns {Promise<TMessage>} Удалённое сообщение
     * @throws {ApiError}
     */
    async deleteMessageAssistant(params: {
        threadId: string;
        messageId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadAssistantApi.deleteMessageAssistant", async () => {
            const { threadId, messageId } = params;
            const { data } = await this.client.http.delete<TMessage>(
                    `/assistant/threads/${threadId}/messages/${messageId}`
            );
            return data;
        });
    }

    /**
     * Регенерация сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @returns {Promise<TMessage>} Новое сгенерированное сообщение
     * @throws {ApiError}
     */
    async regenerateMessageAssistant(params: {
        threadId: string;
        messageId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadAssistantApi.regenerateMessageAssistant", async () => {
            const { threadId, messageId } = params;
            const { data } = await this.client.http.post<TMessage>(
                    `/assistant/threads/${threadId}/messages/${messageId}/regenerate`
            );
            return data;
        });

    }

    /**
     * Удаление треда
     * @param threadId ID треда
     * @returns Результат удаления
     * @throws {ApiError}
     */
    async deleteThreadAssistant(params: {
        threadId: string;
    }): Promise<TMessage> {
        return apiCall("ThreadAssistantApi.deleteThreadAssistant", async () => {
            const { threadId } = params;
            const { data } = await this.client.http.delete<TMessage>(
                    `assistant/threads/${threadId}`
            );
            return data;
        });

    }

    /**
     * Редактирование режима треда
     * @param threadId ID треда
     * @param modeId ID режима
     * @returns Результат удаления
     * @throws {ApiError}
     */
    async editThreadMode(id: string, modeId: string): Promise<any> {
        return apiCall("ThreadAssistantApi.editThreadMode", async () => {
            const { data } = await this.client.http.patch(`/assistant/threads/${id}/mode`, { modeId });
            return data;
        });
    }

    /**
     * @param threadId Идентификатор потока
     * @returns Экземпляр EventSource для обработки событий
     * @throws {ApiError}
     */
    getThreadMessageStream(threadId: string): EventSource {
        const baseURL = this.client.http.defaults.baseURL;
        if (!baseURL) {
            throw new Error("Axios instance must have baseURL for SSE connection");
        }

        const url = `${baseURL}thread/${threadId}/stream?all=1`;

        return new EventSource(url);
    }
    /**
     * Получение EventSource для стриминга сообщений треда.
     *
     * @param threadId ID треда
     * @returns {EventSource} Экземпляр EventSource для обработки событий
     * @throws {ApiError} если EventSource не может быть создан
     */
    getThreadStream(threadId: string): EventSource {
        try {
            const baseURL = this.client.http.defaults.baseURL;
            const url = `${baseURL}thread/${threadId}/stream?all=1`;
            const es = new EventSource(url);
            return es;
        } catch (err) {
            throw new ApiError("Ошибка создания стриминга сообщений треда");
        }
    }
}
