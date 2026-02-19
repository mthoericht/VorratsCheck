import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, Edit, Trash2 } from 'lucide-react';
import type { WishListItem } from '../../stores/wishlistStore';

interface WishlistItemCardProps {
  item: WishListItem;
  onEdit: (item: WishListItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function WishlistItemCard({ item, onEdit, onDelete }: WishlistItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              {item.name}
            </CardTitle>
            {(item.category || item.brand) && (
              <CardDescription>
                {[item.category, item.brand].filter(Boolean).join(' · ')}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
              title="Bearbeiten"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id, item.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {item.category && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Kategorie:</span>
            <span className="font-medium">{item.category}</span>
          </div>
        )}
        {item.brand && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Marke:</span>
            <span className="font-medium">{item.brand}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
