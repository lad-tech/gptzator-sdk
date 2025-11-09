import { GptzatorClient } from '../client';
import { TInvite, TInvitesDTO } from '../types/invites';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с приглашениями в организацию
 */
export class InvitesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка приглашений
     * @param params Параметры запроса
     * @param params.search Поиск по email
     * @param params.page Номер страницы
     * @param params.invitesPerPage Количество приглашений на страницу
     * @returns {Promise<TInvitesDTO>} Коллекция приглашений
     * @throws {ApiError}
     */
    async getInvitesList(params: {
        search?: string;
        page: number;
        invitesPerPage?: number;
    }): Promise<TInvitesDTO> {
        return apiCall("InvitesApi.getInvitesList", async () => {
            const { data } = await this.client.http.get<TInvitesDTO>(`/orgs_invites`, {
                params: {
                    email: { contains: params.search },
                    page: params.page,
                    limit: params.invitesPerPage,
                    depth: 0,
                },
            });
            return data;
        });
    }

    /**
     * Получение конкретного приглашения по токену
     * @param organizationInviteToken Токен приглашения
     * @returns {Promise<Pick<TInvite, 'organization' | 'email'>>} Организация и email приглашённого
     * @throws {ApiError}
     */
    async getInvite(
            organizationInviteToken: string
    ): Promise<Pick<TInvite, 'organization' | 'email'>> {
        return apiCall("InvitesApi.getInvite", async () => {
            const { data } = await this.client.http.get<
                    Pick<TInvite, 'organization' | 'email'>
            >(`/orgs/invites/${organizationInviteToken}`);
            return data;
        });
    }

    /**
     * Создание приглашения
     * @param email Email пользователя для приглашения
     * @returns {Promise<TInvite>} Созданное приглашение
     * @throws {ApiError}
     */
    async createInvite(email: string): Promise<TInvite> {
        return apiCall("InvitesApi.createInvite", async () => {
            const { data } = await this.client.http.post<TInvite>(`/orgs_invites`, {
                email,
            });
            return data;
        });
    }

    /**
     * Удаление приглашения
     * @param inviteId ID приглашения
     * @returns Удалённое приглашение
     * @throws {ApiError}
     */
    async deleteInvite(inviteId: string): Promise<TInvite> {
        return apiCall("InvitesApi.deleteInvite", async () => {
            const { data } = await this.client.http.delete<TInvite>(
                    `/orgs_invites/${inviteId}`
            );
            return data;
        });
    }
}
