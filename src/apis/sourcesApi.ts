import { GptzatorClient } from '../client';
import {
    TSourcesDTO,
    TSourceDTO,
    TFileSource,
} from '../types/sources';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с источниками данных
 */
export class SourcesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка источников
     * @param params Параметры фильтрации
     * @param params.ids Список ID источников
     * @param params.search Поиск по имени источника
     * @returns {Promise<TSourcesDTO>} Коллекция источников
     * @throws {ApiError}
     */
    async getSources(params: {
        ids?: string[];
        search?: string;
    }): Promise<TSourcesDTO> {
        const { data } = await this.client.http.get<TSourcesDTO>(
                `assistant__sources`,
                {
                    params: {
                        ...(params.ids?.length ? { id: { in: params.ids } } : {}),
                        ...(params.search ? { name: { contains: params.search } } : {}),
                        limit: 50,
                        page: 1,
                    },
                }
        );
        return data;
    }

    /**
     * Загрузка файла источника
     * @param formData FormData с файлом
     * @returns {Promise<TFileSource>} Информация о загруженном файле
     * @throws {ApiError}
     */
    async uploadFileSource(formData: FormData): Promise<TFileSource> {
        return apiCall("SourcesApi.uploadFileSource", async () => {
            const { data } = await this.client.http.post<TFileSource>(
                    `assistant__source_files`,
                    formData
            );
            return data;
        });
    }

    /**
     * Создание источника в рабочем пространстве
     * @param workspaceId ID рабочего пространства
     * @param fileId ID файла источника
     * @param parentSpaceId (опционально) ID родительского пространства
     * @returns Созданный источник
     * @throws {ApiError}
     */
    async createSource(params: {
        workspaceId: string;
        fileId: string;
        parentSpaceId?: string;
    }): Promise<any> {
        return apiCall("SourcesApi.createSource", async () => {
            const { workspaceId, ...data } = params;
            const { data: res } = await this.client.http.post<any>(
                    `assistant/workspaces/${workspaceId}/sources`,
                    data
            );
            return res;
        });
    }

    /**
     * Обновление источника
     * @param id ID источника
     * @param name Новое имя источника
     * @param sesctiption (опционально) Описание
     * @returns {Promise<TSourceDTO>} Обновлённый источник
     * @throws {ApiError}
     */
    async updateSource(params: {
        id: string;
        name: string;
        sesctiption?: string;
    }): Promise<{ doc: TSourceDTO }> {
        return apiCall("SourcesApi.updateSource", async () => {
            const { id, ...data } = params;
            const { data: res } = await this.client.http.patch<{ doc: TSourceDTO }>(
                    `assistant/sources/${id}`,
                    data
            );
            return res;
        });
    }

    /**
     * Удаление источника
     * @param workspaceId ID рабочего пространства
     * @param sourceId ID источника
     * @returns {Promise<TSourceDTO>} Результат удаления
     * @throws {ApiError}
     */
    async deleteSource(params: {
        workspaceId: string;
        sourceId: string;
    }): Promise<any> {
        return apiCall("SourcesApi.deleteSource", async () => {
            const { data } = await this.client.http.delete<any>(
                    `assistant/workspaces/${params.workspaceId}/sources/${params.sourceId}`
            );
            return data;
        });
    }
}
