export { TCollection } from '../shared/types';

export type TMessageChoicesItem = {
    id: string;
    type: string;
    content: string;
    annotations?: Record<string, string>;
};

export type TMessage =
        | {
    id: string;
    choices: TMessageChoicesItem[];
    type: 'gpt' | 'user' | 'userChangeContext';
    userAvatar?: string;
}
        | {
    id: string;
    choices: TMessageChoicesItem[];
    file: { originalFilename: string; filesize: number; mimeType: string };
    type: 'userTextFile';
    userAvatar?: string;
};

export type TThreadContext = {
    id: string;
    title: string;
    value: string;
};

export type TGenerationType = {
    id: string;
    type: string;
    name: string;
};

export type TThread = {
    id: string;
    isGenerating: boolean;
    title: string;
    error?: string | null;
    aiName?: string;
    generationType?: TGenerationType;
    contexts?: TThreadContext[];
};

export type TModel = {
    id: string;
    name: string;
    codeId: string;
    vendor: string;
    description?: string;
    active?: boolean;
};

export type TVault = {
    id: string;
    name: string;
    description?: string;
    llm_instructions?: string;
    token?: string;
    data_title?: string;
    valueTitle?: string;
    createdAt?: string;
    updatedAt?: string;
    organization?: unknown;
    instructions?: string;
    logo?: string;
};

export type TThreadDTO = {
    id: string;
    status: 'generating' | 'wait';
    title: string;
    updatedAt: string;
    createdAt: string;
    latestError: string | null;
    generationType?: TGenerationType;
    model: TModel;
    vault: TVault[];
};
// @ts-ignore
export type TThreadsDTO = TCollection<TThreadDTO>;
// @ts-ignore
export type TMessagesDTO = TCollection<TMessage>;
// @ts-ignore
export type TGenerationTypeDTO = TCollection<TGenerationType>;

export type TThreadsSearchParams = {
    search?: string;
    page: number;
};
