import { useTranslation } from '../../lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { ListChecks } from '@/app/lib/icons';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getAppPalette } from '../../lib/muiTheme';

export interface LowStockItem {
  id: string;
  name: string;
  minQuantity: number;
  unit?: string;
}

interface LowStockCardProps {
  items: LowStockItem[];
}

export function LowStockCard({ items }: LowStockCardProps) 
{
  const { t } = useTranslation();
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
            <ListChecks className="w-5 h-5" />
            {t('dashboard.lowStockTitle')}
          </Box>
        </CardTitle>
        <CardDescription>{t('dashboard.lowStockDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: rowBg, borderRadius: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t('dashboard.minQuantity')}{item.minQuantity} {t(`units.${item.unit || 'stk'}`)}</Typography>
              </Box>
              <Badge variant="outline" style={{ borderColor: danger.value, color: danger.value }}>
                {t('dashboard.restockBadge')}
              </Badge>
            </Box>
          ))}
        </Box>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link to="/must-have">
            {t('dashboard.goToMustHave')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
