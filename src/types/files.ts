export { TCollection } from '../shared/types';

/**
 * Файл
 */
export type TFile = {
    id: string;
    author: string;
    filename: string;
    mimeType: string;
    filesize: number;
    createdAt: string;
    updatedAt?: string;
};

/**
 * Коллекция файлов
 */
// @ts-ignore
export type TFileDTO = TCollection<TFile>;
