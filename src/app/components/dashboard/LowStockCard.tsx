import { useTranslation } from '../../lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { ListChecks } from '@/app/lib/icons';

export interface LowStockItem {
  id: string;
  name: string;
  minQuantity: number;
  unit?: string;
}

interface LowStockCardProps {
  items: LowStockItem[];
}

export function LowStockCard({ items }: LowStockCardProps) 
{
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900">
          <ListChecks className="w-5 h-5" />
          {t('dashboard.lowStockTitle')}
        </CardTitle>
        <CardDescription>{t('dashboard.lowStockDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{t('dashboard.minQuantity')}{item.minQuantity} {t(`units.${item.unit || 'stk'}`)}</p>
              </div>
              <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                {t('dashboard.restockBadge')}
              </Badge>
            </div>
          ))}
        </div>
        <Link to="/must-have">
          <Button variant="outline" className="w-full mt-4">
            {t('dashboard.goToMustHave')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
