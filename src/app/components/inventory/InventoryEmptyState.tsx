import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n';
import { Stack, Typography } from '@mui/material';

interface InventoryEmptyStateProps {
  onAddClick: () => void;
}

export function InventoryEmptyState({ onAddClick }: InventoryEmptyStateProps)
{
  const { t } = useTranslation();
  return (
    <Card className="p-12">
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography color="text.secondary">{t('inventory.noItems')}</Typography>
        <Button className="mt-4" onClick={onAddClick}>
          {t('inventory.addFirstItem')}
        </Button>
      </Stack>
    </Card>
  );
}
