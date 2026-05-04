import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Card } from '../ui/card';
import { getAppPalette } from '../../lib/muiTheme';

interface DealsStatsProps {
  totalCount: number;
  mustHaveCount: number;
  wishListCount: number;
  avgDiscount: number;
}

export function DealsStats({ totalCount, mustHaveCount, wishListCount, avgDiscount }: DealsStatsProps) 
{
  const { t } = useTranslation();
  const theme = useTheme();
  const app = getAppPalette(theme);
  const success = app.success;
  const accent = app.accent;
  const info = app.info;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      <Card>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{t('deals.allDeals')}</Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700 }}>{totalCount}</Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: success.border, backgroundColor: success.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: success.text }}>{t('deals.mustHaveDeals')}</Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: success.value }}>{mustHaveCount}</Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: accent.border, backgroundColor: accent.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: accent.text }}>{t('deals.wishlistDeals')}</Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: accent.value }}>{wishListCount}</Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: info.border, backgroundColor: info.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: info.text }}>{t('deals.avgDiscount')}</Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: info.value }}>{totalCount ? `${avgDiscount}%` : '0%'}</Typography>
        </Box>
      </Card>
    </Box>
  );
}
