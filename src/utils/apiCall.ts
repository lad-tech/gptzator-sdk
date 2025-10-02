import { handleApiError } from "../errors/handleApiError";

/**
 * Обёртка для вызова любого метода API
 * Автоматически обрабатывает ошибки через handleApiError
 * @param fn Асинхронная функция, которая возвращает Promise
 * @param context Сообщение контекста для ошибок
 */
export async function apiCall<T>(context: string, fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        handleApiError(error, context);
    }
}
