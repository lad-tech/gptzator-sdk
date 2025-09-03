export { TCollection } from '../shared/types';

/**
 * Сотрудник организации
 */
export type TEmployee = {
    id: string;
    email: string;
    avatar?: string;
    stats?: {
        day: number;
        week: number;
        month: number;
    };
};

/**
 * Приглашение в организацию
 */
export type TInvite = {
    id: string;
    organization: string;
    email: string;
    token: string;
    status: 'registered' | 'sent';
    createdAt: string;
    updatedAt?: string;
    employee: TEmployee;
};

/**
 * Фильтр для списка приглашений
 */
export type TInviteFilterParams = {
    search?: string;
};

/**
 * Коллекция приглашений
 */
// @ts-ignore
export type TInvitesDTO = TCollection<TInvite>;
