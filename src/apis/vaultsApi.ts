import { GptzatorClient } from '../client';
import {
    TVault,
    TVaultsDTO,
    TVaultTagsDTO,
    TCreateVaultForm,
} from '../types/vaults';

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
     * @returns Коллекция Vaults
     */
    async getVaults(params: {
        tag?: string;
        search?: string;
        page: number;
        vaultsPerPage?: number;
    }): Promise<TVaultsDTO> {
        const { data } = await this.client.http.get<TVaultsDTO>(`vaults`, {
            params,
        });
        return data;
    }

    /**
     * Получение Vault по ID
     * @param id ID хранилища
     * @returns Объект Vault
     */
    async getVault(id: string): Promise<TVault> {
        const { data } = await this.client.http.get<TVault>(`vaults/${id}`);
        return data;
    }

    /**
     * Получение Vaults по списку ID
     * @param ids Список идентификаторов
     * @returns Коллекция Vaults
     */
    async getVaultsByIds(ids: string[]): Promise<TVaultsDTO> {
        const { data } = await this.client.http.get<TVaultsDTO>(`vaults`, {
            params: { where: { id: { in: ids } } },
        });
        return data;
    }

    /**
     * Получение избранных Vaults пользователя
     * @returns Массив Vaults
     */
    async getFavouriteVaults(): Promise<TVault[]> {
        const { data } = await this.client.http.get<{ user: { favoriteVaults?: TVault[] } }>(
                `users/me`
        );
        return data.user.favoriteVaults ?? [];
    }

    /**
     * Добавление/удаление Vault из избранного
     * @param id ID хранилища
     * @param isFavourite true — добавить, false — убрать
     */
    async updateIsFavouriteVault(params: {
        id: string;
        isFavourite: boolean;
    }): Promise<void> {
        const { id, isFavourite } = params;
        const method = isFavourite ? 'POST' : 'DELETE';
        await this.client.http.request({
            url: `users/me/favorites/vaults/${id}`,
            method,
        });
    }

    /**
     * Получение тегов Vaults
     * @returns Коллекция тегов
     */
    async getVaultTags(): Promise<TVaultTagsDTO> {
        const { data } = await this.client.http.get<TVaultTagsDTO>(`vaults_tags`, {
            params: { page: 1 },
        });
        return data;
    }

    /**
     * Создание Vault
     * @param data DTO формы создания Vault
     * @returns Созданный Vault
     */
    async createVault(data: TCreateVaultForm): Promise<TVault> {
        const { data: res } = await this.client.http.post<{ doc: TVault }>(
                `vaults?depth=0`,
                data
        );
        return res.doc;
    }

    /**
     * Редактирование Vault
     * @param data DTO формы Vault
     * @returns Обновлённый Vault
     */
    async editVault(data: TCreateVaultForm): Promise<TVault> {
        const { id, ...body } = data;
        const { data: res } = await this.client.http.patch<{ doc: TVault }>(
                `vaults/${id}`,
                body
        );
        return res.doc;
    }

    /**
     * Удаление Vault
     * @param id ID хранилища
     * @returns DTO с удалёнными Vaults
     */
    async deleteVault(id: string): Promise<TVaultsDTO> {
        const { data } = await this.client.http.delete<TVaultsDTO>(`vaults`, {
            params: { where: { id: { equals: id } } },
        });
        return data;
    }
}
