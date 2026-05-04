import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getAppPalette } from '../../lib/muiTheme';

export interface ExpiredItem {
  id: string;
  name: string;
  expiryDate?: string;
}

interface ExpiredItemsCardProps {
  items: ExpiredItem[];
}

export function ExpiredItemsCard({ items }: ExpiredItemsCardProps) 
{
  const { t, formatDate } = useTranslation();
  const theme = useTheme();
  const danger = getAppPalette(theme).danger;
  const rowBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.06)
      : alpha(theme.palette.common.black, 0.04);

  if (items.length === 0) return null;

  return (
    <Card sx={{ borderColor: danger.border, bgcolor: danger.bg }}>
      <CardHeader>
        <CardTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: danger.text }}>
            <AlertTriangle className="w-5 h-5" />
            {t('dashboard.expiredItems')}
          </Box>
        </CardTitle>
        <CardDescription>{t('dashboard.expiredDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: rowBg, borderRadius: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t('dashboard.expiredPrefix')}{item.expiryDate ? formatDate(item.expiryDate) : ''}</Typography>
              </Box>
              <Badge variant="destructive">{t('dashboard.expired')}</Badge>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
