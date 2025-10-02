import { GptzatorClient } from '../client';
import {
    TVault,
    TVaultsDTO,
    TVaultTagsDTO,
    TCreateVaultForm,
} from '../types/vaults';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с Vault (хранилищами)
 */
export class VaultsApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка Vaults
     * @param tag (опционально) фильтрация по тегу
     * @param search (опционально) строка поиска
     * @param page Номер страницы
     * @param vaultsPerPage Количество элементов на странице
     * @returns {Promise<TVaultsDTO>} Коллекция Vaults
     * @throws {ApiError}
     */
    async getVaults(params: {
        tag?: string;
        search?: string;
        page: number;
        vaultsPerPage?: number;
    }): Promise<TVaultsDTO> {
        return apiCall("VaultsApi.getVaults", async () => {
            const { data } = await this.client.http.get<TVaultsDTO>(`vaults`, {
                params,
            });
            return data;
        });
    }

    /**
     * Получение Vault по ID
     * @param id ID хранилища
     * @returns {Promise<TVault>} Объект Vault
     * @throws {ApiError}
     */
    async getVault(id: string): Promise<TVault> {
        return apiCall("VaultsApi.getVault", async () => {
            const { data } = await this.client.http.get<TVault>(`vaults/${id}`);
            return data;
        });
    }

    /**
     * Получение Vaults по списку ID
     * @param ids Список идентификаторов
     * @returns {Promise<TVaultsDTO>} Коллекция Vaults
     * @throws {ApiError}
     */
    async getVaultsByIds(ids: string[]): Promise<TVaultsDTO> {
        return apiCall("VaultsApi.getVaultsByIds", async () => {
            const { data } = await this.client.http.get<TVaultsDTO>(`vaults`, {
                params: { where: { id: { in: ids } } },
            });
            return data;
        });
    }

    /**
     * Получение избранных Vaults пользователя
     * @returns {Promise<TVault[]>} Массив Vaults
     * @throws {ApiError}
     */
    async getFavouriteVaults(): Promise<TVault[]> {
        return apiCall("VaultsApi.getFavouriteVaults", async () => {
            const { data } = await this.client.http.get<{ user: { favoriteVaults?: TVault[] } }>(
                    `users/me`
            );
            return data.user.favoriteVaults ?? [];
        });
    }

    /**
     * Добавление/удаление Vault из избранного
     * @param id ID хранилища
     * @param isFavourite true — добавить, false — убрать
     * @throws {ApiError}
     */
    async updateIsFavouriteVault(params: {
        id: string;
        isFavourite: boolean;
    }): Promise<void> {
        return apiCall("VaultsApi.updateIsFavouriteVault", async () => {
            const { id, isFavourite } = params;
            const method = isFavourite ? 'POST' : 'DELETE';
            await this.client.http.request({
                url: `users/me/favorites/vaults/${id}`,
                method,
            });
        });
    }

    /**
     * Получение тегов Vaults
     * @returns {Promise<TVaultTagsDTO>} Коллекция тегов
     * @throws {ApiError}
     */
    async getVaultTags(): Promise<TVaultTagsDTO> {
        return apiCall("VaultsApi.getVaultTags", async () => {
            const { data } = await this.client.http.get<TVaultTagsDTO>(`vaults_tags`, {
                params: { page: 1 },
            });
            return data;
        });
    }

    /**
     * Создание Vault
     * @param data DTO формы создания Vault
     * @returns {Promise<TVault>} Созданный Vault
     * @throws {ApiError}
     */
    async createVault(data: TCreateVaultForm): Promise<TVault> {
        return apiCall("VaultsApi.createVault", async () => {
            const { data: res } = await this.client.http.post<{ doc: TVault }>(
                    `vaults?depth=0`,
                    data
            );
            return res.doc;
        });
    }

    /**
     * Редактирование Vault
     * @param data DTO формы Vault
     * @returns {Promise<TVault>} Обновлённый Vault
     * @throws {ApiError}
     */
    async editVault(data: TCreateVaultForm): Promise<TVault> {
        return apiCall("VaultsApi.editVault", async () => {
            const { id, ...body } = data;
            const { data: res } = await this.client.http.patch<{ doc: TVault }>(
                    `vaults/${id}`,
                    body
            );
            return res.doc;
        });

    }

    /**
     * Удаление Vault
     * @param id ID хранилища
     * @returns {Promise<TVaultsDTO>} DTO с удалёнными Vaults
     * @throws {ApiError}
     */
    async deleteVault(id: string): Promise<TVaultsDTO> {
        return apiCall("VaultsApi.deleteVault", async () => {
            const { data } = await this.client.http.delete<TVaultsDTO>(`vaults`, {
                params: { where: { id: { equals: id } } },
            });
            return data;
        });
    }
}
