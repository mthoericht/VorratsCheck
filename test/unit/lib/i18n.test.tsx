import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTranslation } from '@/app/lib/i18n';
import { useSettingsStore } from '@/app/stores/settingsStore';

/** Renders a component that uses useTranslation and displays t/formatted values for assertions. */
function TestConsumer({
  keyToTranslate,
  params,
  dateToFormat,
}: {
  keyToTranslate: string;
  params?: Record<string, string | number>;
  dateToFormat?: string | Date;
}) 
{
  const { t, currentLocale, formatDate } = useTranslation();
  return (
    <div>
      <span data-testid="currentLocale">{currentLocale}</span>
      <span data-testid="translation">{t(keyToTranslate, params)}</span>
      {dateToFormat != null && (
        <span data-testid="formatted-date">{formatDate(dateToFormat)}</span>
      )}
    </div>
  );
}

describe('i18n', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  describe('useTranslation', () => 
  {
    describe('locale', () => 
    {
      it('returns current locale from settings store (de)', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(<TestConsumer keyToTranslate="common.save" />);
        expect(screen.getByTestId('currentLocale').textContent).toBe('de');
      });

      it('returns current locale from settings store (en)', () => 
      {
        useSettingsStore.setState({ locale: 'en' });
        render(<TestConsumer keyToTranslate="common.save" />);
        expect(screen.getByTestId('currentLocale').textContent).toBe('en');
      });
    });

    describe('t (translation)', () => 
    {
      it('returns German string for known key when locale is de', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(<TestConsumer keyToTranslate="common.save" />);
        expect(screen.getByTestId('translation').textContent).toBe('Speichern');
      });

      it('returns English string for known key when locale is en', () => 
      {
        useSettingsStore.setState({ locale: 'en' });
        render(<TestConsumer keyToTranslate="common.save" />);
        expect(screen.getByTestId('translation').textContent).toBe('Save');
      });

      it('returns nested key value (e.g. nav.settings)', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(<TestConsumer keyToTranslate="nav.settings" />);
        expect(screen.getByTestId('translation').textContent).toBe('Einstellungen');
      });

      it('uses English for locale en', () => 
      {
        useSettingsStore.setState({ locale: 'en' });
        render(<TestConsumer keyToTranslate="common.save" />);
        expect(screen.getByTestId('translation').textContent).toBe('Save');
      });

      it('returns key when key is missing in both locales', () => 
      {
        render(<TestConsumer keyToTranslate="missing.nested.key" />);
        expect(screen.getByTestId('translation').textContent).toBe('missing.nested.key');
      });

      it('interpolates {{param}} placeholders with given params', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(
          <TestConsumer
            keyToTranslate="common.deleted"
            params={{ name: 'Milch' }}
          />
        );
        expect(screen.getByTestId('translation').textContent).toBe('Milch wurde gelöscht');
      });

      it('interpolates in English when locale is en', () => 
      {
        useSettingsStore.setState({ locale: 'en' });
        render(
          <TestConsumer
            keyToTranslate="common.removed"
            params={{ name: 'Brot' }}
          />
        );
        expect(screen.getByTestId('translation').textContent).toBe('Brot was removed');
      });

      it('leaves placeholder when param is missing', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(<TestConsumer keyToTranslate="common.deleted" />);
        expect(screen.getByTestId('translation').textContent).toBe('{{name}} wurde gelöscht');
      });

      it('replaces numeric param as string', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(
          <TestConsumer
            keyToTranslate="inventory.daysLeft"
            params={{ days: 3 }}
          />
        );
        expect(screen.getByTestId('translation').textContent).toBe('3 Tage');
      });
    });

    describe('formatDate', () => 
    {
      it('formats valid date string in German locale (DD.MM.YYYY)', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(
          <TestConsumer keyToTranslate="common.save" dateToFormat="2025-03-15" />
        );
        expect(screen.getByTestId('formatted-date').textContent).toBe('15.03.2025');
      });

      it('formats valid date string in English locale (MM/DD/YYYY)', () => 
      {
        useSettingsStore.setState({ locale: 'en' });
        render(
          <TestConsumer keyToTranslate="common.save" dateToFormat="2025-03-15" />
        );
        expect(screen.getByTestId('formatted-date').textContent).toBe('03/15/2025');
      });

      it('formats Date object', () => 
      {
        useSettingsStore.setState({ locale: 'de' });
        render(
          <TestConsumer
            keyToTranslate="common.save"
            dateToFormat={new Date('2025-12-31')}
          />
        );
        expect(screen.getByTestId('formatted-date').textContent).toBe('31.12.2025');
      });

      it('returns empty string for invalid date string', () => 
      {
        render(
          <TestConsumer keyToTranslate="common.save" dateToFormat="not-a-date" />
        );
        expect(screen.getByTestId('formatted-date').textContent).toBe('');
      });

      it('returns empty string for invalid Date', () => 
      {
        render(
          <TestConsumer
            keyToTranslate="common.save"
            dateToFormat={new Date('invalid')}
          />
        );
        expect(screen.getByTestId('formatted-date').textContent).toBe('');
      });
    });
  });
});
