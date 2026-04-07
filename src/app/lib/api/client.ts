import { ApiError } from './errors';
import { translate } from '../i18n';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Token provider registered by authStore – single source of truth for the JWT token.
// Falls back to localStorage for environments without the store (e.g. integration tests).
let tokenProvider: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function registerTokenProvider(provider: () => string | null) 
{
  tokenProvider = provider;
}

export function registerUnauthorizedHandler(handler: () => void)
{
  unauthorizedHandler = handler;
}

export function getAuthHeader(): Record<string, string> 
{
  const token = tokenProvider ? tokenProvider() : localStorage.getItem('vorratscheck_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Translate a server error key (e.g. "serverErrors.invalidCredentials") with optional params. */
function translateError(data: Record<string, unknown>): string
{
  const key = typeof data?.error === 'string' ? data.error : '';
  if (!key) return translate('serverErrors.unknownError');
  
  const params = (typeof data?.params === 'object' && data.params !== null)
    ? data.params as Record<string, string | number>
    : undefined;
  return translate(key, params);
}

/** Internal HTTP client – use only via the resource-specific API functions. */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> 
{
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  let res: Response;
  try 
  {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
    });
  }
  catch (e) 
  {
    const message = e instanceof Error ? e.message : translate('serverErrors.networkError');
    throw new ApiError(message, 0, e);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) 
  {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(translateError(data), res.status, data);
  }

  return data as T;
}
