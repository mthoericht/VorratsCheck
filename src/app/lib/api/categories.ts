import { api } from './client';

const basePath = '/api/categories';

export async function getCategories<T>(): Promise<T> 
{
  return api<T>(basePath);
}

export async function createCategory<T>(name: string): Promise<T> 
{
  return api<T>(basePath, {
    method: 'POST',
    body: JSON.stringify({ name: name.trim() }),
  });
}

export async function deleteCategory(id: string): Promise<void> 
{
  await api<void>(`${basePath}/${id}`, { method: 'DELETE' });
}
