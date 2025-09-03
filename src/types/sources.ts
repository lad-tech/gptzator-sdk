export { TCollection } from '../shared/types';

/**
 * Статус выполнения источника
 */
export enum SourceExecutionStatus {
    IN_PROGRESS = 'in-progress',
    SUCCESS = 'success',
    FAIL = 'fail',
}

/**
 * Источник данных
 */
export type TSourceDTO = {
    id: string;
    author: string;
    name: string;
    config: {
        type: string;
        documents: {
            rag: object;
            fileId: {
                mimeType: string;
            };
        };
    };
    executionStatus: SourceExecutionStatus;
    isEnable: boolean;
    updatedAt: string;
};

/**
 * Коллекция источников
 */
// @ts-ignore
export type TSourcesDTO = TCollection<TSourceDTO>;

/**
 * Загруженный файл источника
 */
export type TFileSource = {
    doc: {
        id: string;
        author: string;
        filename: string;
        mimeType: string;
        filesize: number;
        createdAt: string;
        updatedAt?: string;
        prefix: string;
        url: string;
    };
};
