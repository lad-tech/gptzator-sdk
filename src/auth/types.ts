export type Tokens = {
  accessToken: string;
  refreshToken?: string;
};

export interface TokenStorage {
  get(): Tokens | null;
  set(tokens: Tokens | null): void;
}

export type RefreshFn = (refreshToken: string) => Promise<Tokens>;
