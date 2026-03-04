import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Globe } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { useSettingsStore } from '../../stores/settingsStore';

export function SettingsLanguage()
{
  const { t, currentLocale } = useTranslation();
  const setLocale = useSettingsStore((s) => s.setLocale);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.languageTitle')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('settings.languageDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('settings.languageTitle')}
          </CardTitle>
          <CardDescription>
            {t('settings.languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language">{t('settings.languageLabel')}</Label>
            <Select
              value={currentLocale}
              onValueChange={(value) => setLocale(value as 'de' | 'en')}
            >
              <SelectTrigger id="language" className="w-full max-w-xs">
                <SelectValue placeholder={t('settings.languagePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">
                  <span className="flex items-center gap-2">🇩🇪 {t('settings.languageDe')}</span>
                </SelectItem>
                <SelectItem value="en">
                  <span className="flex items-center gap-2">🇬🇧 {t('settings.languageEn')}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
