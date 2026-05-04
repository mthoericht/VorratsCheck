import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Heart } from '@/app/lib/icons';
import { useTranslation } from '../../lib/i18n';
import { Stack, Typography } from '@mui/material';

interface WishlistEmptyStateProps {
  onAddClick: () => void;
}

export function WishlistEmptyState({ onAddClick }: WishlistEmptyStateProps) 
{
  const { t } = useTranslation();
  return (
    <Card className="p-12">
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Heart className="w-12 h-12 text-gray-300" />
        <Typography color="text.secondary">{t('wishlist.noItems')}</Typography>
        <Button className="mt-4" onClick={onAddClick}>
          {t('wishlist.addFirstItem')}
        </Button>
      </Stack>
    </Card>
  );
}
