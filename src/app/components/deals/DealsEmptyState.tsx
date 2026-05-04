import { Card } from '../ui/card';
import { TrendingDown } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { Stack, Typography } from '@mui/material';

export function DealsEmptyState() 
{
  const { t } = useTranslation();

  return (
    <Card className="p-12">
      <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <TrendingDown className="w-12 h-12 text-gray-300" />
        <Typography color="text.secondary">{t('deals.noDeals')}</Typography>
        <Typography variant="body2" color="text.disabled">
          {t('deals.noDealsHint')}
        </Typography>
      </Stack>
    </Card>
  );
}
