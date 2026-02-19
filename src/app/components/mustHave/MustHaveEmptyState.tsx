import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface MustHaveEmptyStateProps {
  onAddClick: () => void;
}

export function MustHaveEmptyState({ onAddClick }: MustHaveEmptyStateProps) 
{
  return (
    <Card className="p-12 text-center">
      <p className="text-gray-500">Keine Must-Have Artikel definiert</p>
      <Button className="mt-4" onClick={onAddClick}>
        Ersten Artikel hinzufügen
      </Button>
    </Card>
  );
}
