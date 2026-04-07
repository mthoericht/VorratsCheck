import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup } from '../lib/api';
import { registerTokenProvider, registerUnauthorizedHandler } from '../lib/api/client';

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
    (set) => ({
      user: null,
      token: null,
      isLoading: true,

      setLoading: (loading) => set({ isLoading: loading }),

      setUserFromToken: (user, token) => set({ user, token }),

      login: async (email, password) => 
      {
        try 
        {
          const { token, user } = await apiLogin<{ token: string; user: User }>(email, password);
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
          const { token, user } = await apiSignup<{ token: string; user: User }>(
            username,
            email,
            password,
            inviteCode
          );
          set({ user, token });
          return { success: true };
        }
        catch (e) 
        {
          return { success: false, error: (e as Error).message };
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'vorratscheck-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

// Register authStore as the single source of truth for the API client token
registerTokenProvider(() => useAuthStore.getState().token);
registerUnauthorizedHandler(() =>
{
  useAuthStore.getState().logout();
});
