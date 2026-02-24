import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'de' | 'en';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: 'de',
      theme: 'light',
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vorratscheck-settings',
    }
  )
);
