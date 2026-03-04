import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';

export interface ExpiringSoonItem {
  id: string;
  name: string;
  expiryDate?: string;
}

interface ExpiringSoonCardProps {
  items: ExpiringSoonItem[];
  /** Max number of items to show (default 5) */
  maxItems?: number;
}

export function ExpiringSoonCard({ items, maxItems = 5 }: ExpiringSoonCardProps) 
{
  const { t, formatDate } = useTranslation();

  if (items.length === 0) return null;

  const displayItems = items.slice(0, maxItems);

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Clock className="w-5 h-5" />
          {t('dashboard.expiringSoonTitle')}
        </CardTitle>
        <CardDescription>{t('dashboard.expiringSoonDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{t('dashboard.bestBefore')}{item.expiryDate ? formatDate(item.expiryDate) : ''}</p>
              </div>
              <Badge variant="outline" className="border-orange-600 text-orange-600">
                {t('dashboard.expiringBadge')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
