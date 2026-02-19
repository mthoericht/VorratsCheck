import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Heart } from 'lucide-react';

interface WishlistEmptyStateProps {
  onAddClick: () => void;
}

export function WishlistEmptyState({ onAddClick }: WishlistEmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Keine Artikel auf der Wunschliste</p>
      <Button className="mt-4" onClick={onAddClick}>
        Ersten Artikel hinzufügen
      </Button>
    </Card>
  );
}
