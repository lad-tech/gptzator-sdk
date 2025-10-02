import { GptzatorClient } from '../client';
import { TFile, TFileDTO } from '../types/files';
import {apiCall} from "../utils/apiCall";

/**
 * Класс для работы с файлами
 */
export class FilesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Загрузка файла
     * @param formData FormData с файлом
     * @returns Данные о загруженном файле
     * @throws {ApiError}
     */
    async uploadFile(formData: FormData): Promise<any> {
        return apiCall("FilesApi.uploadFile", async () => {
            const { data } = await this.client.http.post(`files`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        });
    }

    /**
     * Получение файла по ID
     * @param id ID файла
     * @returns {Promise<TFile>} Файл
     * @throws {ApiError}
     */
    async getFile(id: string): Promise<TFile> {
        return apiCall("FilesApi.getFile", async () => {
            const { data } = await this.client.http.get<TFile>(`files/${id}`);
            return data;
        });
    }

    /**
     * Получение списка файлов по ID
     * @param ids Список ID файлов
     * @returns {Promise<TFileDTO>} Коллекция файлов
     * @throws {ApiError}
     */
    async getFilesByIds(ids: string[]): Promise<TFileDTO> {
        return apiCall("FilesApi.getFilesByIds", async () => {
            const { data } = await this.client.http.get<TFileDTO>(`files`, {
                params: { where: { id: { in: ids } } },
            });
            return data;
        });
    }

    /**
     * Удаление файла
     * @param fileId ID файла
     * @returns Результат удаления
     * @throws {ApiError}
     */
    async deleteFile(fileId: string): Promise<any> {
        return apiCall("FilesApi.deleteFile", async () => {
            const { data } = await this.client.http.delete(`files`, {
                params: { where: { id: { equals: fileId } } },
            });
            return data;
        });
    }

    /**
     * Загрузка файла для треда
     * @param formData FormData с файлом
     * @returns Данные о загруженном файле для треда
     * @throws {ApiError}
     */
    async uploadThreadFile(formData: FormData): Promise<any> {
        return apiCall("FilesApi.uploadThreadFile", async () => {
            const { data } = await this.client.http.post(`threads_files`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        });
    }

    /**
     * Удаление файла из треда
     * @param fileId ID файла
     * @returns Результат удаления
     * @throws {ApiError}
     */
    async deleteThreadFile(fileId: string): Promise<any> {
        return apiCall("FilesApi.deleteThreadFile", async () => {
            const { data } = await this.client.http.delete(`threads_files`, {
                params: { where: { id: { equals: fileId } } },
            });
            return data;
        });
    }
}
