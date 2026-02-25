/**
 * Lightweight i18n system. Reads locale from settingsStore (Zustand, persisted).
 * Fallback language: English. Usage: const { t, formatDate } = useTranslation();
 */

import { useSettingsStore, type Locale } from '../../stores/settingsStore';
import { de } from './de';
import { en } from './en';

export type { Locale };

const translations: Record<Locale, Record<string, unknown>> = { de, en };

/** Resolve a dot-separated key path (e.g. "dashboard.title") to a string value. */
function resolve(obj: Record<string, unknown>, path: string): string | undefined
{
  let current: unknown = obj;

  for (const key of path.split('.'))
  {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/** Replace {{param}} placeholders with values. */
function interpolate(text: string, params?: Record<string, string | number>): string
{
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] ?? `{{${key}}}`));
}

/** Resolve a key in the given locale with English fallback. */
function resolveKey(locale: Locale, key: string): string
{
  return resolve(translations[locale], key) ?? resolve(translations.en, key) ?? key;
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Non-hook translate function for use outside React components (e.g. API client).
 * Reads locale from the store directly (non-reactive).
 */
export const translate: TranslateFn = (key, params) =>
{
  const locale = useSettingsStore.getState().locale;
  return interpolate(resolveKey(locale, key), params);
};

/**
 * Main i18n hook. Returns:
 * - `t(key, params?)` – translate a key with optional interpolation
 * - `currentLocale` – current locale ('de' | 'en')
 * - `formatDate(date)` – format a date for display in the current locale
 */
export function useTranslation()
{
  const currentLocale = useSettingsStore((s) => s.locale);

  const t: TranslateFn = translate;

  /**
   * Format a date for display in the current locale.
   */
  const formatDate = (date: string | Date): string =>
  {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return '';
    const loc = currentLocale === 'de' ? 'de-DE' : 'en-US';

    return d.toLocaleDateString(loc, { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return { t, currentLocale, formatDate };
}
