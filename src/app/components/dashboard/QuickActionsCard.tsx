import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { Package, ListChecks, Heart } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

export function QuickActionsCard() 
{
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        <CardDescription>{t('dashboard.quickActionsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/inventory">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Package className="w-4 h-4" />
              {t('dashboard.addItem')}
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline" className="w-full justify-start gap-2">
              <ListChecks className="w-4 h-4" />
              {t('dashboard.findRecipes')}
            </Button>
          </Link>
          <Link to="/deals">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Heart className="w-4 h-4" />
              {t('dashboard.viewDeals')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
