import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Sun, Moon, Palette, Monitor } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { useSettingsStore, type Theme } from '../../stores/settingsStore';
import { Stack, Typography } from '@mui/material';

export function SettingsAppearance()
{
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const { t } = useTranslation();

  const themeOptions = [
    { value: 'system', label: t('settings.themeSystem'), icon: Monitor },
    { value: 'light', label: t('settings.themeLight'), icon: Sun },
    { value: 'dark', label: t('settings.themeDark'), icon: Moon },
  ] as const;

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {t('settings.appearanceTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('settings.appearanceDescription')}
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('settings.designTitle')}
          </CardTitle>
          <CardDescription>
            {t('settings.designDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="theme">{t('settings.themeLabel')}</Label>
            <Select
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              <SelectTrigger id="theme" className="w-full max-w-xs">
                <SelectValue placeholder={t('settings.themePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((opt) =>
                {
                  const Icon = opt.icon;
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </Stack>
  );
}
