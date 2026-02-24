import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n';

interface MustHaveEmptyStateProps {
  onAddClick: () => void;
}

export function MustHaveEmptyState({ onAddClick }: MustHaveEmptyStateProps) 
{
  const { t } = useTranslation();
  return (
    <Card className="p-12 text-center">
      <p className="text-gray-500">{t('mustHave.noItems')}</p>
      <Button className="mt-4" onClick={onAddClick}>
        {t('mustHave.addFirstItem')}
      </Button>
    </Card>
  );
}
