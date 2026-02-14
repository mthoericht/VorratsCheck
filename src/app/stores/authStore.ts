import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string, inviteCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUserFromToken: (user: User, token: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      setLoading: (loading) => set({ isLoading: loading }),

      setUserFromToken: (user, token) => 
      {
        localStorage.setItem('vorratscheck_token', token);
        set({ user, token });
      },

      login: async (email, password) => 
      {
        try 
        {
          const { token, user } = await api<{ token: string; user: User }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          localStorage.setItem('vorratscheck_token', token);
          set({ user, token });
          return { success: true };
        }
        catch (e) 
        {
          return { success: false, error: (e as Error).message };
        }
      },

      signup: async (username, email, password, inviteCode) => 
      {
        try 
        {
          const { token, user } = await api<{ token: string; user: User }>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, inviteCode }),
          });
          localStorage.setItem('vorratscheck_token', token);
          set({ user, token });
          return { success: true };
        }
        catch (e) 
        {
          return { success: false, error: (e as Error).message };
        }
      },

      logout: () => 
      {
        localStorage.removeItem('vorratscheck_token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'vorratscheck-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => 
      {
        if (state?.token) localStorage.setItem('vorratscheck_token', state.token);
      },
    }
  )
);
