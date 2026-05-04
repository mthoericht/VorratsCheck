import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n';
import { Stack, Typography } from '@mui/material';

interface MustHaveEmptyStateProps {
  onAddClick: () => void;
}

export function MustHaveEmptyState({ onAddClick }: MustHaveEmptyStateProps) 
{
  const { t } = useTranslation();
  return (
    <Card className="p-12">
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography color="text.secondary">{t('mustHave.noItems')}</Typography>
        <Button className="mt-4" onClick={onAddClick}>
          {t('mustHave.addFirstItem')}
        </Button>
      </Stack>
    </Card>
  );
}
