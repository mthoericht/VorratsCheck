import { api } from './client';

export async function getDeals<T>(): Promise<T> 
{
  return api<T>('/api/deals');
}
