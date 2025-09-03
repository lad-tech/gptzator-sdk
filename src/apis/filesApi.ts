import { GptzatorClient } from '../client';
import { TFile, TFileDTO } from '../types/files';

/**
 * Класс для работы с файлами
 */
export class FilesApi {
    constructor(private readonly client: GptzatorClient) {}

    /**
     * Загрузка файла
     * @param formData FormData с файлом
     * @returns Данные о загруженном файле
     */
    async uploadFile(formData: FormData): Promise<any> {
        const { data } = await this.client.http.post(`files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    /**
     * Получение файла по ID
     * @param id ID файла
     * @returns Файл
     */
    async getFile(id: string): Promise<TFile> {
        const { data } = await this.client.http.get<TFile>(`files/${id}`);
        return data;
    }

    /**
     * Получение списка файлов по ID
     * @param ids Список ID файлов
     * @returns Коллекция файлов
     */
    async getFilesByIds(ids: string[]): Promise<TFileDTO> {
        const { data } = await this.client.http.get<TFileDTO>(`files`, {
            params: { where: { id: { in: ids } } },
        });
        return data;
    }

    /**
     * Удаление файла
     * @param fileId ID файла
     * @returns Результат удаления
     */
    async deleteFile(fileId: string): Promise<any> {
        const { data } = await this.client.http.delete(`files`, {
            params: { where: { id: { equals: fileId } } },
        });
        return data;
    }

    /**
     * Загрузка файла для треда
     * @param formData FormData с файлом
     * @returns Данные о загруженном файле для треда
     */
    async uploadThreadFile(formData: FormData): Promise<any> {
        const { data } = await this.client.http.post(`threads_files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    /**
     * Удаление файла из треда
     * @param fileId ID файла
     * @returns Результат удаления
     */
    async deleteThreadFile(fileId: string): Promise<any> {
        const { data } = await this.client.http.delete(`threads_files`, {
            params: { where: { id: { equals: fileId } } },
        });
        return data;
    }
}
