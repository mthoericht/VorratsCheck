import { useDealsPage } from '../hooks/useDealsPage';
import { DealsStats, DealsFilterBar, DealCard, DealsEmptyState } from '../components/deals';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function Deals()
{
  const {
    dealsFromApi,
    dealsError,
    deals,
    filterType,
    setFilterType,
    mustHaveDealsCount,
    wishListDealsCount,
    avgDiscount,
    isMustHaveDeal,
    isWishListDeal,
  } = useDealsPage();

  const { t } = useTranslation();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {t('deals.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('deals.subtitle')}
        </Typography>
      </Box>

      <StoreErrorAlert error={dealsError} />

      <DealsStats
        totalCount={dealsFromApi.length}
        mustHaveCount={mustHaveDealsCount}
        wishListCount={wishListDealsCount}
        avgDiscount={avgDiscount}
      />

      <DealsFilterBar
        filterType={filterType}
        setFilterType={setFilterType}
        mustHaveCount={mustHaveDealsCount}
        wishListCount={wishListDealsCount}
      />

      {/* Deals Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {deals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            isMustHave={isMustHaveDeal(deal)}
            isWishList={isWishListDeal(deal)}
          />
        ))}
      </Box>

      {deals.length === 0 && <DealsEmptyState />}
    </Stack>
  );
}
