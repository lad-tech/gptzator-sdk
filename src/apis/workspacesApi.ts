import { GptzatorClient } from '../client';
import { TWorkspace, TWorkspaceTree } from '../types/workspaces';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с API рабочих пространств (Workspaces)
 */
export class WorkspacesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получить список рабочих пространств
     *
     * @param params Параметры фильтрации списка
     * @param params.search Поисковая строка (опционально)
     * @param params.limit Количество элементов на странице
     * @returns {Promise<{ workspaces: TWorkspace[] }>} Объект со списком рабочих пространств
     * @throws {ApiError}
     */
    async getWorkspaces(params?: { search?: string, limit?: number }): Promise<{ workspaces: TWorkspace[] }> {
        return apiCall("WorkspacesApi.getWorkspaces", async () => {
            const { data } = await this.client.http.get<{ workspaces: TWorkspace[] }>(
                    '/assistant/workspaces',
                    { params }
            );
            return data;
        });
    }

    /**
     * Создать рабочее пространство
     *
     * @param data Данные для создания рабочего пространства
     * @param data.name Название рабочего пространства
     * @param data.description Описание (опционально)
     * @param data.instructions Инструкции (опционально)
     * @returns {Promise<TWorkspace>} Созданное рабочее пространство
     * @throws {ApiError}
     */
    async createWorkspace(data: {
        name: string;
        description?: string;
        instructions?: string;
    }): Promise<TWorkspace> {
        return apiCall("WorkspacesApi.createWorkspace", async () => {
            const { data: workspace } = await this.client.http.post<TWorkspace>(
                    '/assistant__workspaces?depth=0',
                    data
            );
            return workspace;
        });
    }

    /**
     * Обновить рабочее пространство
     *
     * @param id Идентификатор рабочего пространства
     * @param data Данные для обновления
     * @param data.name Название
     * @param data.description Описание
     * @param data.instructions Инструкции (опционально)
     * @returns {Promise<TWorkspace>} Обновлённое рабочее пространство
     * @throws {ApiError}
     */
    async updateWorkspace(
            id: string,
            data: { name: string; description: string; instructions?: string }
    ): Promise<TWorkspace> {
        return apiCall("WorkspacesApi.updateWorkspace", async () => {
            const { data: workspace } = await this.client.http.patch<TWorkspace>(
                    `/assistant__workspaces/${id}?depth=0`,
                    data
            );
            return workspace;
        });
    }

    /**
     * Удалить рабочее пространство
     *
     * @param id Идентификатор рабочего пространства
     * @returns {Promise<TWorkspace>} Удалённое рабочее пространство
     * @throws {ApiError}
     */
    async deleteWorkspace(id: string): Promise<TWorkspace> {
        return apiCall("WorkspacesApi.deleteWorkspace", async () => {
            const { data } = await this.client.http.delete<TWorkspace>(
                    `/assistant/workspaces/${id}`
            );
            return data;
        });
    }

    /**
     * Получить рабочее пространство по ID
     *
     * @param id Идентификатор рабочего пространства
     * @returns {Promise<TWorkspace>} Объект рабочего пространства
     * @throws {ApiError}
     */
    async getWorkspaceById(id: string): Promise<TWorkspace> {
        return apiCall("WorkspacesApi.getWorkspaceById", async () => {
            const { data } = await this.client.http.get<TWorkspace>(
                    `/assistant__workspaces/${id}?depth=0`
            );
            return data;
        });
    }

    /**
     * Получить дерево источников и вложенных пространств
     *
     * @param id Идентификатор рабочего пространства
     * @returns {Promise<TWorkspaceTree>} Дерево с источниками, вложенными пространствами и данными workspace
     * @throws {ApiError}
     */
    async getWorkspaceSourcesTree(id: string): Promise<TWorkspaceTree> {
        return apiCall("WorkspacesApi.getWorkspaceSoutcesTree", async () => {
            const { data } = await this.client.http.get<TWorkspaceTree>(
                    `/assistant/workspaces/${id}/tree`
            );
            return data;
        });
    }
}
