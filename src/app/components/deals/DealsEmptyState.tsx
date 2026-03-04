import { Card } from '../ui/card';
import { TrendingDown } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';

export function DealsEmptyState() 
{
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{t('deals.noDeals')}</p>
      <p className="text-sm text-gray-400 mt-2">
        {t('deals.noDealsHint')}
      </p>
    </Card>
  );
}
