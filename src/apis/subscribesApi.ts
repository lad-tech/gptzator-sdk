import { GptzatorClient } from '../client';
import {
    TSubscribeDTO,
    TProductDTO,
} from '../types/subscribes';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с подписками и продуктами
 */
export class SubscribesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Получение списка подписок
     * @returns {Promise<TSubscribeDTO>} Коллекция подписок
     * @throws {ApiError}
     */
    async getSubscribes(): Promise<TSubscribeDTO> {
        return apiCall("SubscribesApi.getSubscribes", async () => {
            const { data } = await this.client.http.get<TSubscribeDTO>(
                    `/subscribes?depth=1`
            );
            return data;
        });
    }

    /**
     * Получение списка продуктов
     * @returns {Promise<TProductDTO>} Коллекция продуктов
     * @throws {ApiError}
     */
    async getProducts(): Promise<TProductDTO> {
        return apiCall("SubscribesApi.getProducts", async () => {
            const { data } = await this.client.http.get<TProductDTO>(`/products`);
            return data;
        });
    }

    /**
     * Получение ссылки для подписки
     * @param subscribeId ID продукта для подписки
     * @returns {Promise<{ uri: string }>} Объект с URI для оплаты
     * @throws {ApiError}
     */
    async getSubscribeUrl(
            subscribeId: string
    ): Promise<{ uri: string }> {
        return apiCall("SubscribesApi.getSubscribeUrl", async () => {
            const { data } = await this.client.http.get<{ uri: string }>(
                    `/transactions/paymenturi?productId=${subscribeId}`
            );
            return data;
        });
    }

    /**
     * Применение купона
     * @param couponCode Код купона
     * @returns {Promise<{ message?: string }>} Сообщение об успехе или ошибке
     * @throws {ApiError}
     */
    async applyCoupon(params: {
        couponCode: string;
    }): Promise<{ message?: string }> {
        return apiCall("SubscribesApi.applyCoupon", async () => {
            const { data } = await this.client.http.post<{ message?: string }>(
                    `/coupons/apply`,
                    { couponCode: params.couponCode }
            );
            return data;
        });
    }
}
