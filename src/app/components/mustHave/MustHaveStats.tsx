import { StatCard } from '../ui/stat-card';
import { useTranslation } from '../../lib/i18n';

interface MustHaveStatsProps {
  totalCount: number;
  sufficientCount: number;
  lowCount: number;
}

export function MustHaveStats({ totalCount, sufficientCount, lowCount }: MustHaveStatsProps) 
{
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title={t('mustHave.totalItems')} value={totalCount} />
      <StatCard
        title={t('mustHave.sufficient')}
        value={sufficientCount}
        valueClassName="text-2xl font-bold text-green-600"
      />
      <StatCard
        title={t('mustHave.restock')}
        value={lowCount}
        valueClassName="text-2xl font-bold text-red-600"
      />
    </div>
  );
}
