export { TCollection } from '../shared/types';

/**
 * Продукт (подписка или разовая покупка)
 */
export type TProduct = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    price: number;
    tokens: number;
    type: 'subscription' | 'once';
    updatedAt: string;
    tags?: string[];
};

/**
 * Подписка пользователя
 */
export type TSubscribe = {
    id: string;
    createdAt: string;
    endDate: string;
    updatedAt: string;
    sum: number;
    paied?: boolean;
    product: TProduct;
};

/**
 * DTO подписок
 */
// @ts-ignore
export type TSubscribeDTO = TCollection<TSubscribe>;

/**
 * DTO продуктов
 */
// @ts-ignore
export type TProductDTO = TCollection<TProduct>;
