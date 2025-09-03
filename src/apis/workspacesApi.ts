import { GptzatorClient } from '../client';
import { TWorkspace, TWorkspaceTree } from '../types/workspaces';

/**
 * Класс для работы с API рабочих пространств (Workspaces)
 */
export class WorkspacesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получить список рабочих пространств
     * GET /assistant/workspaces
     *
     * @param params Параметры фильтрации списка
     * @param params.search Поисковая строка (опционально)
     * @returns Объект со списком рабочих пространств { workspaces: TWorkspace[] }
     */
    async getWorkspaces(params?: { search?: string }): Promise<{ workspaces: TWorkspace[] }> {
        const { data } = await this.client.http.get<{ workspaces: TWorkspace[] }>(
                '/assistant/workspaces',
                { params }
        );
        return data;
    }

    /**
     * Создать рабочее пространство
     * POST assistant__workspaces?depth=0
     *
     * @param data Данные для создания рабочего пространства
     * @param data.name Название рабочего пространства
     * @param data.description Описание (опционально)
     * @param data.instructions Инструкции (опционально)
     * @returns Созданное рабочее пространство
     */
    async createWorkspace(data: {
        name: string;
        description?: string;
        instructions?: string;
    }): Promise<TWorkspace> {
        const { data: workspace } = await this.client.http.post<TWorkspace>(
                'assistant__workspaces?depth=0',
                data
        );
        return workspace;
    }

    /**
     * Обновить рабочее пространство
     * PATCH assistant__workspaces/:id?depth=0
     *
     * @param id Идентификатор рабочего пространства
     * @param data Данные для обновления
     * @param data.name Название
     * @param data.description Описание
     * @param data.instructions Инструкции (опционально)
     * @returns Обновлённое рабочее пространство
     */
    async updateWorkspace(
            id: string,
            data: { name: string; description: string; instructions?: string }
    ): Promise<TWorkspace> {
        const { data: workspace } = await this.client.http.patch<TWorkspace>(
                `assistant__workspaces/${id}?depth=0`,
                data
        );
        return workspace;
    }

    /**
     * Удалить рабочее пространство
     * DELETE /assistant/workspaces/:id
     *
     * @param id Идентификатор рабочего пространства
     * @returns Удалённое рабочее пространство
     */
    async deleteWorkspace(id: string): Promise<TWorkspace> {
        const { data } = await this.client.http.delete<TWorkspace>(
                `/assistant/workspaces/${id}`
        );
        return data;
    }

    /**
     * Получить рабочее пространство по ID
     * GET assistant__workspaces/:id?depth=0
     *
     * @param id Идентификатор рабочего пространства
     * @returns Объект рабочего пространства
     */
    async getWorkspaceById(id: string): Promise<TWorkspace> {
        const { data } = await this.client.http.get<TWorkspace>(
                `assistant__workspaces/${id}?depth=0`
        );
        return data;
    }

    /**
     * Получить дерево источников и вложенных пространств
     * GET /assistant/workspaces/:id/tree
     *
     * @param id Идентификатор рабочего пространства
     * @returns Дерево с источниками, вложенными пространствами и данными workspace
     */
    async getWorkspaceSourcesTree(id: string): Promise<TWorkspaceTree> {
        const { data } = await this.client.http.get<TWorkspaceTree>(
                `/assistant/workspaces/${id}/tree`
        );
        return data;
    }
}
