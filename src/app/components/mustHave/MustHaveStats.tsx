import { StatCard } from '../ui/stat-card';

interface MustHaveStatsProps {
  totalCount: number;
  sufficientCount: number;
  lowCount: number;
}

export function MustHaveStats({ totalCount, sufficientCount, lowCount }: MustHaveStatsProps) 
{
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Gesamt Artikel" value={totalCount} />
      <StatCard
        title="Ausreichend vorrätig"
        value={sufficientCount}
        valueClassName="text-2xl font-bold text-green-600"
      />
      <StatCard
        title="Nachkaufen"
        value={lowCount}
        valueClassName="text-2xl font-bold text-red-600"
      />
    </div>
  );
}
