import { StatCard } from '../ui/stat-card';
import { useTranslation } from '../../lib/i18n';

interface DealsStatsProps {
  totalCount: number;
  mustHaveCount: number;
  wishListCount: number;
  avgDiscount: number;
}

export function DealsStats({ totalCount, mustHaveCount, wishListCount, avgDiscount }: DealsStatsProps) 
{
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title={t('deals.allDeals')} value={totalCount} />
      <StatCard
        title={t('deals.mustHaveDeals')}
        value={mustHaveCount}
        className="border-emerald-200"
        titleClassName="text-sm font-medium text-emerald-800"
        valueClassName="text-2xl font-bold text-emerald-600"
      />
      <StatCard
        title={t('deals.wishlistDeals')}
        value={wishListCount}
        className="border-pink-200"
        titleClassName="text-sm font-medium text-pink-800"
        valueClassName="text-2xl font-bold text-pink-600"
      />
      <StatCard
        title={t('deals.avgDiscount')}
        value={totalCount ? `${avgDiscount}%` : '0%'}
        className="border-blue-200"
        titleClassName="text-sm font-medium text-blue-800"
        valueClassName="text-2xl font-bold text-blue-600"
      />
    </div>
  );
}
