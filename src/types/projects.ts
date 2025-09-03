export { TCollection } from '../shared/types';

export type TCardItem = {
  title: string;
  description?: string;
  checked: boolean;
};

export type TSelectedImage = { src: string; width: number; height: number };

export type TAction = {
  id: string;
  blockName: string;
  blockType: string;
  slug?: string;
  description?: string;
};

export type TApplication = { id: string; name?: string; actions?: TAction[]; emoji?: string };

export type TErrorCode = 'parseJSON' | 'artefactNextSlugNotFound' | 'jsonataEvaluateEmpty';

export type TArtefact<T> = {
  data: T;
  id: string;
  name: string;
  slug?: string;
  nextSlug?: string;
  itemSlug?: string;
  completion_tokens?: number;
  prompt_tokens?: number;
  metadata: {
    annotations?: Record<string, string>;
    regenerating: boolean;
    artefactType: string;
    artefactName: string;
    actionDescription?: string;
    actionDemoDescription?: string;
    actionId: string;
    isHidden?: boolean;
    artefactBlock?: string;
    duration: {
      differenceInSeconds: number;
      endedAt: string;
      startedAt: string;
    };
    price: number;
  };
};

export type TProjectDTO = {
  id: string;
  name: string;
  idea: string;
  updatedAt: string;
  createdAt: string;
  generating: boolean;
  application: TApplication;
  actions?: TAction[];
  isError: boolean;
  lastGenerationError: string | null;
  error?: { slug: string; code: TErrorCode; description: string; meta: Record<string, any> };
  artefacts: TArtefact<any>[];
  isDemo?: boolean;
};

// @ts-ignore
export type TProjectsDTO = TCollection<TProjectDTO>;
