import axios from "axios";
import { ApiError } from "./ApiError";

/**
 * Нормализует и пробрасывает ошибку как ApiError.
 * Поддерживает AxiosError, Error, string и "object"-ошибки.
 * @param error Неизвестный объект ошибки
 * @param context Опциональный контекст (например "UserApi.loginUser")
 * @throws {ApiError} */
export function handleApiError(error: unknown, context?: string): never {
    let message = "Неизвестная ошибка";
    let status: number | undefined;
    let data: any;

    if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
        status = error.response?.status;
        data = error.response?.data;
    } else if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === "object" && error !== null) {
        const err = error as any;
        if (err.response?.data?.message) {
            message = err.response.data.message;
            status = err.response.status;
            data = err.response.data;
        } else if (err.message) {
            message = err.message;
        } else {
            try {
                message = JSON.stringify(err);
            } catch {
                // игнорируем ошибку при сериализации
            }
        }
    } else if (typeof error === "string") {
        message = error;
    }

    if (context) {
        message = `[${context}] ${message}`;
    }

    throw new ApiError(message, status, data);
}

