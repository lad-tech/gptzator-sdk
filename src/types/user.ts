/**
 * Пользователь
 */
export type TUser = {
  id: string;
  role?: string;
  type: string;
  balance: string;
  isInternal?: boolean;
  email: string;
  createdAt: string;
  updatedAt: string;
  policy: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  purchasedTokens: number;
  freeTokens?: number;
  telegramToken: string;
  onboarded?: Record<string, boolean>;
  defaultModel: TDefaultModel;
  defaultThreadModel: TDefaultThreadModel;
  meta: { oauth?: TUserOauthClient };
  avatar?: TUserAvatar;
  organization?: TOrganization;
  isOrgManager?: boolean;
};

/**
 * Организация пользователя
 */
export type TOrganization = {
  id: string;
  name: string;
};

/**
 * Аватар пользователя
 */
export type TUserAvatar = {
  id: string;
  url: string;
};

/**
 * Модель по умолчанию
 */
export type TDefaultModel = {
  id: string;
  name: string;
  codeId: string;
  vendor: string;
  description?: string;
};

/**
 * Модель потока по умолчанию
 */
export type TDefaultThreadModel = TDefaultModel;

/**
 * Данные OAuth клиента пользователя
 */
export type TUserOauthClient = Record<
  string,
  { profile: { firstName: string; lastName: string; email: string } }
>;
