import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface InventoryEmptyStateProps {
  onAddClick: () => void;
}

export function InventoryEmptyState({ onAddClick }: InventoryEmptyStateProps)
{
  return (
    <Card className="p-12 text-center">
      <p className="text-gray-500">Keine Artikel gefunden</p>
      <Button className="mt-4" onClick={onAddClick}>
        Ersten Artikel hinzufügen
      </Button>
    </Card>
  );
}
