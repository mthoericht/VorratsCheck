import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n';

interface InventoryEmptyStateProps {
  onAddClick: () => void;
}

export function InventoryEmptyState({ onAddClick }: InventoryEmptyStateProps)
{
  const { t } = useTranslation();
  return (
    <Card className="p-12 text-center">
      <p className="text-gray-500">{t('inventory.noItems')}</p>
      <Button className="mt-4" onClick={onAddClick}>
        {t('inventory.addFirstItem')}
      </Button>
    </Card>
  );
}
