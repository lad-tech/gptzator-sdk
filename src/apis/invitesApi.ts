import { GptzatorClient } from '../client';
import { TInvite, TInvitesDTO } from '../types/invites';

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
     * @returns Коллекция приглашений
     */
    async getInvitesList(params: {
        search?: string;
        page: number;
        invitesPerPage?: number;
    }): Promise<TInvitesDTO> {
        const { data } = await this.client.http.get<TInvitesDTO>(`orgs_invites`, {
            params: {
                email: { contains: params.search },
                page: params.page,
                limit: params.invitesPerPage,
                depth: 0,
            },
        });
        return data;
    }

    /**
     * Получение конкретного приглашения по токену
     * @param organizationInviteToken Токен приглашения
     * @returns Организация и email приглашённого
     */
    async getInvite(
            organizationInviteToken: string
    ): Promise<Pick<TInvite, 'organization' | 'email'>> {
        const { data } = await this.client.http.get<
                Pick<TInvite, 'organization' | 'email'>
        >(`orgs/invites/${organizationInviteToken}`);
        return data;
    }

    /**
     * Создание приглашения
     * @param email Email пользователя для приглашения
     * @returns Созданное приглашение
     */
    async createInvite(email: string): Promise<TInvite> {
        const { data } = await this.client.http.post<TInvite>(`orgs_invites`, {
            email,
        });
        return data;
    }

    /**
     * Удаление приглашения
     * @param inviteId ID приглашения
     * @returns Удалённое приглашение
     */
    async deleteInvite(inviteId: string): Promise<TInvite> {
        const { data } = await this.client.http.delete<TInvite>(
                `orgs_invites/${inviteId}`
        );
        return data;
    }
}
