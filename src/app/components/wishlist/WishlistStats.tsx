import type { WishListItem } from '../../stores/wishlistStore';
import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Card } from '../ui/card';
import { getAppPalette } from '../../lib/muiTheme';
interface WishlistStatsProps {
  items: WishListItem[];
}

export function WishlistStats({ items }: WishlistStatsProps) 
{
  const { t } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const highPalette = appPalette.danger;
  const mediumPalette = appPalette.warning;
  const lowPalette = appPalette.success;
  const grouped = {
    high: items.filter((i) => i.priority === 'high'),
    medium: items.filter((i) => i.priority === 'medium'),
    low: items.filter((i) => i.priority === 'low'),
  };

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
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {t('wishlist.total')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700 }}>
            {items.length}
          </Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: highPalette.border, backgroundColor: highPalette.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: highPalette.text }}>
            {t('wishlist.highPriority')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: highPalette.value }}>
            {grouped.high.length}
          </Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: mediumPalette.border, backgroundColor: mediumPalette.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: mediumPalette.text }}>
            {t('wishlist.mediumPriority')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: mediumPalette.value }}>
            {grouped.medium.length}
          </Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: lowPalette.border, backgroundColor: lowPalette.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: lowPalette.text }}>
            {t('wishlist.lowPriority')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: lowPalette.value }}>
            {grouped.low.length}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
