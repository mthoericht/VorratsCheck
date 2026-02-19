import { ApiError } from './errors';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export function getAuthHeader(): Record<string, string> 
{
  const token = localStorage.getItem('vorratscheck_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Interner HTTP-Client – nur über die ressourcenspezifischen API-Funktionen verwenden. */
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
    const message = e instanceof Error ? e.message : 'Netzwerkfehler';
    throw new ApiError(message, 0, e);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  const message = typeof data?.error === 'string' ? data.error : res.statusText || 'Unbekannter Fehler';

  if (!res.ok) 
  {
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
