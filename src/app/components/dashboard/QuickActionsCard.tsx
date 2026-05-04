import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { Box } from '@mui/material';
import { Refrigerator, ListChecks, Heart } from '@/app/lib/icons';
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
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link to="/inventory">
              <Refrigerator className="w-4 h-4" />
              {t('dashboard.addItem')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link to="/recipes">
              <ListChecks className="w-4 h-4" />
              {t('dashboard.findRecipes')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link to="/deals">
              <Heart className="w-4 h-4" />
              {t('dashboard.viewDeals')}
            </Link>
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
