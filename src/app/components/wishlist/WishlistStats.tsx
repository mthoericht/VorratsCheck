import { StatCard } from '../ui/stat-card';
import type { WishListItem } from '../../stores/wishlistStore';
interface WishlistStatsProps {
  items: WishListItem[];
}

export function WishlistStats({ items }: WishlistStatsProps) 
{
  const grouped = {
    high: items.filter((i) => i.priority === 'high'),
    medium: items.filter((i) => i.priority === 'medium'),
    low: items.filter((i) => i.priority === 'low'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Gesamt" value={items.length} />
      <StatCard
        title="Hohe Priorität"
        value={grouped.high.length}
        className="border-red-200"
        titleClassName="text-sm font-medium text-red-800"
        valueClassName="text-2xl font-bold text-red-600"
      />
      <StatCard
        title="Mittlere Priorität"
        value={grouped.medium.length}
        className="border-yellow-200"
        titleClassName="text-sm font-medium text-yellow-800"
        valueClassName="text-2xl font-bold text-yellow-600"
      />
      <StatCard
        title="Niedrige Priorität"
        value={grouped.low.length}
        className="border-green-200"
        titleClassName="text-sm font-medium text-green-800"
        valueClassName="text-2xl font-bold text-green-600"
      />
    </div>
  );
}
