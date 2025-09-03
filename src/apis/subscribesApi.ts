import { GptzatorClient } from '../client';
import {
    TSubscribeDTO,
    TProductDTO,
} from '../types/subscribes';

/**
 * Класс для работы с подписками и продуктами
 */
export class SubscribesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка подписок
     * @returns Коллекция подписок
     */
    async getSubscribes(): Promise<TSubscribeDTO> {
        const { data } = await this.client.http.get<TSubscribeDTO>(
                `subscribes?depth=1`
        );
        return data;
    }

    /**
     * Получение списка продуктов
     * @returns Коллекция продуктов
     */
    async getProducts(): Promise<TProductDTO> {
        const { data } = await this.client.http.get<TProductDTO>(`products`);
        return data;
    }

    /**
     * Получение ссылки для подписки
     * @param subscribeId ID продукта для подписки
     * @returns Объект с URI для оплаты
     */
    async getSubscribeUrl(
            subscribeId: string
    ): Promise<{ uri: string }> {
        const { data } = await this.client.http.get<{ uri: string }>(
                `transactions/paymenturi?productId=${subscribeId}`
        );
        return data;
    }

    /**
     * Применение купона
     * @param couponCode Код купона
     * @returns Сообщение об успехе или ошибке
     */
    async applyCoupon(params: {
        couponCode: string;
    }): Promise<{ message?: string }> {
        const { data } = await this.client.http.post<{ message?: string }>(
                `coupons/apply`,
                { couponCode: params.couponCode }
        );
        return data;
    }
}
