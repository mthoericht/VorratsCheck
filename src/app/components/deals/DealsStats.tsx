import { StatCard } from '../ui/stat-card';

interface DealsStatsProps {
  totalCount: number;
  mustHaveCount: number;
  wishListCount: number;
  avgDiscount: number;
}

export function DealsStats({ totalCount, mustHaveCount, wishListCount, avgDiscount }: DealsStatsProps) 
{
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Alle Angebote" value={totalCount} />
      <StatCard
        title="Must-Have Angebote"
        value={mustHaveCount}
        className="border-emerald-200"
        titleClassName="text-sm font-medium text-emerald-800"
        valueClassName="text-2xl font-bold text-emerald-600"
      />
      <StatCard
        title="Wunschliste Angebote"
        value={wishListCount}
        className="border-pink-200"
        titleClassName="text-sm font-medium text-pink-800"
        valueClassName="text-2xl font-bold text-pink-600"
      />
      <StatCard
        title="Durchschnitt Ersparnis"
        value={totalCount ? `${avgDiscount}%` : '0%'}
        className="border-blue-200"
        titleClassName="text-sm font-medium text-blue-800"
        valueClassName="text-2xl font-bold text-blue-600"
      />
    </div>
  );
}
