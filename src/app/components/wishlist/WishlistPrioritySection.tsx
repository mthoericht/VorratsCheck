import { Badge } from '../ui/badge';
import { getPriorityColor, getPriorityLabel, type WishlistPriority } from './priorityUtils';
import { WishlistItemCard } from './WishlistItemCard';
import type { WishListItem } from '../../stores/wishlistStore';

interface WishlistPrioritySectionProps {
  priority: WishlistPriority;
  items: WishListItem[];
  onEdit: (item: WishListItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function WishlistPrioritySection({
  priority,
  items,
  onEdit,
  onDelete,
}: WishlistPrioritySectionProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Badge className={getPriorityColor(priority)}>{getPriorityLabel(priority)}</Badge>
        <span className="text-gray-600">({items.length})</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
