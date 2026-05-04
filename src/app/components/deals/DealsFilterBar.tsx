import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { DealsFilterType } from '../../hooks/useDealsPage';
import { useTranslation } from '../../lib/i18n';
import { Box } from '@mui/material';

interface DealsFilterBarProps {
  filterType: DealsFilterType;
  setFilterType: (type: DealsFilterType) => void;
  mustHaveCount: number;
  wishListCount: number;
}

export function DealsFilterBar({ filterType, setFilterType, mustHaveCount, wishListCount }: DealsFilterBarProps) 
{
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
      <Button
        variant={filterType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('all')}
      >
        {t('deals.allDeals')}
      </Button>
      <Button
        variant={filterType === 'mustHave' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('mustHave')}
        className="gap-2"
      >
        {t('deals.mustHave')}
        {mustHaveCount > 0 && (
          <Badge variant="secondary" className="ml-1">{mustHaveCount}</Badge>
        )}
      </Button>
      <Button
        variant={filterType === 'wishList' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('wishList')}
        className="gap-2"
      >
        {t('deals.wishlist')}
        {wishListCount > 0 && (
          <Badge variant="secondary" className="ml-1">{wishListCount}</Badge>
        )}
      </Button>
    </Box>
  );
}
