export { TCollection } from '../shared/types';

/**
 * Vault (хранилище)
 */
export type TVault = {
    id: string;
    name: string;
    type: 'json' | 'app' | 'mongodb';
    applicationsToLaunch?: string[];
    description?: string;
    llm_instructions?: string;
    token: string;
    data_title?: string;
    valueTitle?: string;
    createdAt?: string;
    updatedAt?: string;
    organization?: unknown;
    instructions?: string;
    isFavorite?: boolean;
    logo?: string;
    author?: string;
    tags?: string[];
    value?: string;
    embeddingSettings?: { model: string; contextSizeInChars?: number };
};

/**
 * Параметры фильтрации Vaults
 */
export type TVaultsFilterParams = {
    tag?: string;
    search?: string;
};

/** Тег хранилища */
export type TVaultTag = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

/** DTO коллекции Vaults */
// @ts-ignore
export type TVaultsDTO = TCollection<TVault>;
/** DTO коллекции тегов */
// @ts-ignore
export type TVaultTagsDTO = TCollection<TVaultTag>;

/**
 * Поля формы для Vault
 */
export enum ECreateVaultFormFields {
    ID = 'id',
    NAME = 'name',
    TAGS = 'tags',
    DESCRIPTION = 'description',
    INSTRUCTIONS = 'instructions',
    TYPE = 'type',
    IS_PUBLIC = 'isPublic',
    VALUE = 'value',
    OPTIONS = 'options',
    AUTHOR = 'author',
    EMBEDDING_SETTINGS = 'embeddingSettings',
    CONTEXT_SIZE_IN_CHARS = 'contextSizeInChars',
    MODEL = 'model',
    APP_TO_LAUNCH = 'applicationsToLaunch',
}

/**
 * DTO формы создания Vault
 */
export type TCreateVaultForm = {
    [ECreateVaultFormFields.ID]: string;
    [ECreateVaultFormFields.NAME]: string;
    [ECreateVaultFormFields.TAGS]: string[];
    [ECreateVaultFormFields.TYPE]: string;
    [ECreateVaultFormFields.APP_TO_LAUNCH]: string[];
    [ECreateVaultFormFields.DESCRIPTION]?: string;
    [ECreateVaultFormFields.INSTRUCTIONS]?: string;
    [ECreateVaultFormFields.IS_PUBLIC]: boolean;
    [ECreateVaultFormFields.VALUE]: string;
    [ECreateVaultFormFields.OPTIONS]: string;
    [ECreateVaultFormFields.AUTHOR]: string;
    [ECreateVaultFormFields.EMBEDDING_SETTINGS]: {
        [ECreateVaultFormFields.MODEL]: string;
        [ECreateVaultFormFields.CONTEXT_SIZE_IN_CHARS]: number;
    };
};
