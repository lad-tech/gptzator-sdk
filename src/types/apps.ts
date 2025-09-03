export { TCollection } from '../shared/types';

/**
 * Действие внутри приложения
 */
export type TAction = {
  id: string;
  blockName: string;
  blockType: string;
  model: string;
  prompt: string;
  slug: string;
  type: string;
  nextSlug?: string;
  itemSlug?: string;
  isHidden: boolean;
  nodeProps?: Record<string, any>;
};

/**
 * OAuth клиент приложения
 */
export type TOauthClient = {
  id: string;
  name: string;
  type: string;
  code: string;
  hasLogged: boolean;
  url: string;
};

/**
 * Приложение
 */
export type TApp = {
  id: string | null;
  name: string | null;
  description?: string;
  descriptionSmall?: string;
  placeholder?: string;
  imageurl?: string;
  videoId?: string;
  isFavourite: boolean;
  isPrivate: boolean;
  isRecommend?: boolean;
  isStartButton?: boolean;
  tags?: string[];
  actions?: TAction[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  demoProject?: string;
  oauthClients: string[];
  approximateCost: number;
  emoji?: string;
  settings?: Record<string, any>[];
  ragSettings?: { isEnable: boolean; embeddingQueryString: string; contextSizeInChars?: number };
};

/**
 * Тег приложения
 */
export type TAppTag = { name: string; id: string; createdAt: string; updatedAt: string };

/**
 * DTO списка приложений
 */
export type TAppsDTO = {
  docs: TApp[];
  totalDocs: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

/**
 * Шаблон настроек приложения
 */
export type TSettingsTemplate = {
  id: string;
  author: string;
  app: string;
  name: string;
  values?: Record<string, any>;
  isDefault: boolean;
  isPrivate: boolean;
  isActive: boolean;
};

/**
 * DTO коллекции шаблонов настроек
 */
// @ts-ignore
export type TSettingsTemplateDTO = TCollection<TSettingsTemplate>;

/**
 * DTO коллекции тегов
 */
// @ts-ignore
export type TTagsDTO = TCollection<TAppTag>;

/**
 * Меню приложений
 */
export type TAppsMenu =
  | {
      id: string;
      type: 'group';
      name: string;
      iconUrl?: string;
      description?: string;
      children: TAppsMenu[];
      isSelected?: boolean;
    }
  | {
      id: string;
      type: 'action';
      name: string;
      iconUrl?: string;
      description?: string;
      action: TAction;
    };
