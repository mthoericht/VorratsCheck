import { StatCard } from '../ui/stat-card';
import type { WishListItem } from '../../stores/wishlistStore';
import { useTranslation } from '../../lib/i18n';
interface WishlistStatsProps {
  items: WishListItem[];
}

export function WishlistStats({ items }: WishlistStatsProps) 
{
  const { t } = useTranslation();
  const grouped = {
    high: items.filter((i) => i.priority === 'high'),
    medium: items.filter((i) => i.priority === 'medium'),
    low: items.filter((i) => i.priority === 'low'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title={t('wishlist.total')} value={items.length} />
      <StatCard
        title={t('wishlist.highPriority')}
        value={grouped.high.length}
        className="border-red-200"
        titleClassName="text-sm font-medium text-red-800"
        valueClassName="text-2xl font-bold text-red-600"
      />
      <StatCard
        title={t('wishlist.mediumPriority')}
        value={grouped.medium.length}
        className="border-yellow-200"
        titleClassName="text-sm font-medium text-yellow-800"
        valueClassName="text-2xl font-bold text-yellow-600"
      />
      <StatCard
        title={t('wishlist.lowPriority')}
        value={grouped.low.length}
        className="border-green-200"
        titleClassName="text-sm font-medium text-green-800"
        valueClassName="text-2xl font-bold text-green-600"
      />
    </div>
  );
}
