import { TokenStorage, Tokens } from './types';

/** Память процесса (по умолчанию — безопасно для Node и SSR) */
export class InMemoryTokenStorage implements TokenStorage {
  private tokens: Tokens | null = null;
  get() {
    return this.tokens;
  }
  set(tokens: Tokens | null) {
    this.tokens = tokens;
  }
}

/** Локальное хранилище браузера (опционально для SPA) */
export class LocalStorageTokenStorage implements TokenStorage {
  constructor(private key = 'gptz_sdk_tokens') {}
  get(): Tokens | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  }
  set(tokens: Tokens | null) {
    if (typeof window === 'undefined') return;
    if (!tokens) window.localStorage.removeItem(this.key);
    else window.localStorage.setItem(this.key, JSON.stringify(tokens));
  }
}
