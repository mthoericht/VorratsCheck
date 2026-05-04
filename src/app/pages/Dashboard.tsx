import { useInventoryStore } from '../stores/inventoryStore';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getStockStatus } from '../lib/mustHave';
import { useTranslation } from '../lib/i18n';
import { getAppPalette } from '../lib/muiTheme';
import { ExpiredItemsCard, ExpiringSoonCard, LowStockCard, QuickActionsCard } from '../components/dashboard';
import { Clock, Refrigerator, Heart, TrendingDown } from '@/app/lib/icons';
import { StoreErrorAlert } from '../components/ui/store-error-alert';
import { Card } from '../components/ui/card';

export function Dashboard() 
{
  const { t } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const inventory = useInventoryStore((s) => s.items);
  const inventoryError = useInventoryStore((s) => s.error);
  const mustHaveList = useMustHaveStore((s) => s.items);
  const wishList = useWishlistStore((s) => s.items);

  // Calculate expiring soon items (within 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const expiringSoon = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= sevenDaysFromNow && expiryDate >= today;
  });

  const expired = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate < today;
  });

  // Low stock: same unit-aware logic as Must-Have list (weight→g, volume→ml, countable→same unit)
  const lowStockItems = mustHaveList.filter((mustHave) =>
    getStockStatus(mustHave, inventory).isLow
  );
  const neutralPalette = appPalette.neutral;
  const warningPalette = appPalette.warning;
  const dangerPalette = appPalette.danger;
  const accentPalette = appPalette.accent;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('dashboard.subtitle')}
        </Typography>
      </Box>

      <StoreErrorAlert error={inventoryError} />

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <Card>
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('dashboard.totalItems')}
              </Typography>
              <Refrigerator className="w-4 h-4" style={{ color: neutralPalette.icon }} />
            </Box>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700 }}>
              {inventory.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('dashboard.inStock')}
            </Typography>
          </Box>
        </Card>
        <Card sx={{ borderColor: warningPalette.border, backgroundColor: warningPalette.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: warningPalette.text }}>
                {t('dashboard.expiringSoon')}
              </Typography>
              <Clock className="w-4 h-4" style={{ color: warningPalette.icon }} />
            </Box>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: warningPalette.value }}>
              {expiringSoon.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('dashboard.next7Days')}
            </Typography>
          </Box>
        </Card>
        <Card sx={{ borderColor: dangerPalette.border, backgroundColor: dangerPalette.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: dangerPalette.text }}>
                {t('dashboard.lowStock')}
              </Typography>
              <TrendingDown className="w-4 h-4" style={{ color: dangerPalette.icon }} />
            </Box>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: dangerPalette.value }}>
              {lowStockItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('dashboard.restock')}
            </Typography>
          </Box>
        </Card>
        <Card sx={{ borderColor: accentPalette.border, backgroundColor: accentPalette.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: accentPalette.text }}>
                {t('dashboard.wishlist')}
              </Typography>
              <Heart className="w-4 h-4" style={{ color: accentPalette.icon }} />
            </Box>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: accentPalette.value }}>
              {wishList.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('common.items')}
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Alerts */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        <ExpiredItemsCard items={expired} />
        <ExpiringSoonCard items={expiringSoon} maxItems={5} />
        <LowStockCard items={lowStockItems} />
      </Box>

      <QuickActionsCard />
    </Stack>
  );
}
