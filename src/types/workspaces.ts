export { TCollection } from '../shared/types';

/**
 * DTO коллекции рабочих пространств
 */
// @ts-ignore
export type TWorkspacesDTO = TCollection<TWorkspace>;

/**
 * Статусы выполнения источников в рабочем пространстве
 */
export enum SourceExecutionStatus {
    IN_PROGRESS = 'in-progress',
    SUCCESS = 'success',
    FAIL = 'fail'
}

/**
 * Модель рабочего пространства
 */
export type TWorkspace = {
    id: string;
    author: string;
    name: string;
    description?: string;
    instructions?: string;
    sources: { all: []; root: [] };
    spaces: { root: [] };
};

/**
 * Модель дерева рабочего пространства
 */
export type TWorkspaceTree = {
    sources: {
        id: string;
        name: string;
        type: string;
        executionStatus: {
            state: SourceExecutionStatus;
            lastRunAt: string;
            lastSuccessAt: string;
        };
        file: {
            id: string;
            name: string;
            mimeType: string;
            filesize: number;
        };
    }[];
    spaces: [];
    workspace: {
        id: string;
        name: string;
        description: string;
    };
};
