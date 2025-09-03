export { TCollection } from '../shared/types';

export type TAssistant = {
    id: string;
    name: string;
    description: string;
    image: { id: string; url: string };
    scope: 'org' | 'public' | 'personal';
    isDefault: boolean;
    organization?: string;
    organizationId?: string;
    author?: string;
    canEdit?: boolean;
    welcomeMessage?: string;
    modes: TAssistantModeDTO[];
    workspaceIds: string[];
    ctx: {
        modeId: string;
        workspaces: string[];
    };

    createdAt: string;
    updatedAt: string;
};

export type TAssistantGeneralSettings = {
    name?: string;
    description?: string;
    imageId?: string;
    welcomeMessage?: string;
    scope: 'org' | 'public' | 'personal';
};

export type TAssistantMode = {
    id: string;
    name?: string;
    instructions?: string;
    llm?: {
        modelId?: string;
        temperature?: number;
    };
    apps?: {
        toolIds?: string[];
        systemMessageIds?: string[];
    };
};

export type TAssistantContext = {
    modeId?: string;
    workspaces?: string[];
};
// @ts-ignore
export type TAssistantsDTO = TCollection<TAssistant>;

export type TCreateAssistantRequest = TAssistantGeneralSettings & {
    modes: TAssistantMode[];
};

export type TUpdateAssistantContextRequest = { modeId?: string; workspaceIds?: string[] };

export type TAssistantModeDTO = {
    instructions: any;
    id: string;
    name?: string;
    isDefault?: boolean;
    isSelected?: boolean;

    llm?: {
        modelId: string;
        temperature: number;
        recentMessageCount: number;
        maxTokens: number;
    };

    rag?: {
        embeddingModelId: string;
        type: string;
        contextSizeInChars: number;
        minMatchPercent: number;
    };

    apps?: {
        toolIds: string[];
        systemMessageIds: string[];
    };

    createdAt: string;
    updatedAt: string;
};
