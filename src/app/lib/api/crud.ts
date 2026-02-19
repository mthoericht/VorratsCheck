import { api } from './client';

export interface CrudApi 
{
  get: <T>() => Promise<T>;
  create: <T>(body: Record<string, unknown>) => Promise<T>;
  update: <T>(id: string, body: Record<string, unknown>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export function createCrud(basePath: string): CrudApi 
{
  return {
    get: <T>() => api<T>(basePath),

    create: <T>(body: Record<string, unknown>) =>
      api<T>(basePath, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: <T>(id: string, body: Record<string, unknown>) =>
      api<T>(`${basePath}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: (id: string) => api<void>(`${basePath}/${id}`, { method: 'DELETE' }),
  };
}
