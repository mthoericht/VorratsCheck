import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getAppPalette } from '../../lib/muiTheme';

export interface ExpiringSoonItem {
  id: string;
  name: string;
  expiryDate?: string;
}

interface ExpiringSoonCardProps {
  items: ExpiringSoonItem[];
  /** Max number of items to show (default 5) */
  maxItems?: number;
}

export function ExpiringSoonCard({ items, maxItems = 5 }: ExpiringSoonCardProps) 
{
  const { t, formatDate } = useTranslation();
  const theme = useTheme();
  const warning = getAppPalette(theme).warning;
  const rowBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.06)
      : alpha(theme.palette.common.black, 0.04);

  if (items.length === 0) return null;

  const displayItems = items.slice(0, maxItems);

  return (
    <Card sx={{ borderColor: warning.border, bgcolor: warning.bg }}>
      <CardHeader>
        <CardTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: warning.text }}>
            <Clock className="w-5 h-5" />
            {t('dashboard.expiringSoonTitle')}
          </Box>
        </CardTitle>
        <CardDescription>{t('dashboard.expiringSoonDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {displayItems.map(item => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: rowBg, borderRadius: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t('dashboard.bestBefore')}{item.expiryDate ? formatDate(item.expiryDate) : ''}</Typography>
              </Box>
              <Badge variant="outline" style={{ borderColor: '#ea580c', color: '#ea580c' }}>
                {t('dashboard.expiringBadge')}
              </Badge>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
