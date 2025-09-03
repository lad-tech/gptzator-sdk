import { GptzatorClient } from '../client';
import {
    TThreadsAssistantDTO,
    TThreadAssistantDTO,
    IGetMessagesResponse,
    TMessagesSearchParams,
    TMessage,
} from '../types/threadAssistant';

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
     * @returns Коллекция тредов
     */
    async getThreadsByWorkspaceId(params: {
        id: string;
        page: number;
        search?: string;
    }): Promise<TThreadsAssistantDTO> {
        const { data } = await this.client.http.get<TThreadsAssistantDTO>(
                `assistant__threads`,
                { params }
        );
        return data;
    }

    /**
     * Получение тредов по assistantId
     * @param id ID ассистента
     * @param page Номер страницы
     * @param search Поисковый запрос
     * @returns Коллекция тредов
     */
    async getThreadsByAssistantId(params: {
        id: string;
        page: number;
        search?: string;
    }): Promise<TThreadsAssistantDTO> {
        const { data } = await this.client.http.get<TThreadsAssistantDTO>(
                `assistant__threads`,
                { params }
        );
        return data;
    }

    /**
     * Создание треда в workspace
     * @param id ID рабочего пространства
     * @param title Заголовок треда
     * @returns Созданный тред
     */
    async createThreadByWorkspaceId(params: {
        id: string;
        title: string;
    }): Promise<TThreadAssistantDTO> {
        const { id, ...body } = params;
        const { data } = await this.client.http.post<TThreadAssistantDTO>(
                `assistant/workspaces/${id}/threads?depth=0`,
                body
        );
        return data;
    }

    /**
     * Создание треда для ассистента
     * @param id ID ассистента
     * @param title Заголовок
     * @param modeId (опционально) ID режима
     * @returns Созданный тред
     */
    async createThreadByAssistantId(params: {
        id: string;
        title: string;
        modeId?: string;
    }): Promise<TThreadAssistantDTO> {
        const { id, ...body } = params;
        const { data } = await this.client.http.post<TThreadAssistantDTO>(
                `/assistant/assistants/${id}/threads`,
                body
        );
        return data;
    }

    /**
     * Обновление треда ассистента
     * @param thread Обновлённый объект треда
     * @returns Обновлённый тред
     */
    async updateThreadAssistant(
            thread: TThreadAssistantDTO
    ): Promise<TThreadAssistantDTO> {
        const { id, ...body } = thread;
        const { data } = await this.client.http.patch<TThreadAssistantDTO>(
                `assistant__threads/${id}?depth=0`,
                body
        );
        return data;
    }

    /**
     * Получение треда по ID
     * @param id ID треда
     * @returns Тред
     */
    async getThreadAssistantById(id: string): Promise<TThreadAssistantDTO> {
        const { data } = await this.client.http.get<TThreadAssistantDTO>(
                `assistant__threads/${id}`
        );
        return data;
    }

    /**
     * Получение сообщений ассистента
     * @param threadId ID треда
     * @param page Номер страницы
     * @returns Сообщения
     */
    async getMessagesAssistant(
            params: TMessagesSearchParams
    ): Promise<IGetMessagesResponse> {
        const { threadId, page = 1 } = params;
        const { data } = await this.client.http.get<IGetMessagesResponse>(
                `assistant__thread_messages`,
                { params: { thread: { equals: threadId }, page } }
        );
        return data;
    }

    /**
     * Создание сообщения
     * @param text Текст сообщения
     * @param threadId ID треда
     * @returns Созданное сообщение
     */
    async createMessageAssistant(params: {
        text: string;
        threadId: string;
    }): Promise<TMessage> {
        const { threadId, text } = params;
        const { data } = await this.client.http.post<TMessage>(
                `assistant/threads/${threadId}/messages`,
                { text }
        );
        return data;
    }

    /**
     * Редактирование сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @param content Новый текст
     * @returns Обновлённое сообщение
     */
    async editMessageAssistant(params: {
        threadId: string;
        messageId: string;
        content: string;
    }): Promise<TMessage> {
        const { threadId, messageId, content } = params;
        const { data } = await this.client.http.patch<TMessage>(
                `/assistant/threads/${threadId}/messages/${messageId}`,
                { content }
        );
        return data;
    }

    /**
     * Удаление сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @returns Удалённое сообщение
     */
    async deleteMessageAssistant(params: {
        threadId: string;
        messageId: string;
    }): Promise<TMessage> {
        const { threadId, messageId } = params;
        const { data } = await this.client.http.delete<TMessage>(
                `/assistant/threads/${threadId}/messages/${messageId}`
        );
        return data;
    }

    /**
     * Регенерация сообщения
     * @param threadId ID треда
     * @param messageId ID сообщения
     * @returns Новое сгенерированное сообщение
     */
    async regenerateMessageAssistant(params: {
        threadId: string;
        messageId: string;
    }): Promise<TMessage> {
        const { threadId, messageId } = params;
        const { data } = await this.client.http.post<TMessage>(
                `/assistant/threads/${threadId}/messages/${messageId}/regenerate`
        );
        return data;
    }

    /**
     * Удаление треда
     * @param threadId ID треда
     * @returns Результат удаления
     */
    async deleteThreadAssistant(params: {
        threadId: string;
    }): Promise<TMessage> {
        const { threadId } = params;
        const { data } = await this.client.http.delete<TMessage>(
                `assistant/threads/${threadId}`
        );
        return data;
    }
}
