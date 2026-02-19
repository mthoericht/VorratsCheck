import { api } from './client';

const basePath = '/api/must-have';

export async function getMustHave<T>(): Promise<T> 
{
  return api<T>(basePath);
}

export async function createMustHaveItem<T>(item: Record<string, unknown>): Promise<T> 
{
  return api<T>(basePath, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function deleteMustHaveItem(id: string): Promise<void> 
{
  await api<void>(`${basePath}/${id}`, { method: 'DELETE' });
}
