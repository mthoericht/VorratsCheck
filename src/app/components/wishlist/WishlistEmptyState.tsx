import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Heart } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';

interface WishlistEmptyStateProps {
  onAddClick: () => void;
}

export function WishlistEmptyState({ onAddClick }: WishlistEmptyStateProps) 
{
  const { t } = useTranslation();
  return (
    <Card className="p-12 text-center">
      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">{t('wishlist.noItems')}</p>
      <Button className="mt-4" onClick={onAddClick}>
        {t('wishlist.addFirstItem')}
      </Button>
    </Card>
  );
}
