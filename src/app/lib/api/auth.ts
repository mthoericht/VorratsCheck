import { api } from './client';

export async function login<T>(email: string, password: string): Promise<T> 
{
  return api<T>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup<T>(
  username: string,
  email: string,
  password: string,
  inviteCode: string
): Promise<T> 
{
  return api<T>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, inviteCode }),
  });
}
