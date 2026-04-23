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

/**
 * Settings store for the application. (is persisted to localStorage)
 * @returns {SettingsState} The settings store.
 */
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
