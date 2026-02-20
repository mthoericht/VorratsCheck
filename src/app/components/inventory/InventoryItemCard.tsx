import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pencil, Trash2, AlertTriangle, MapPin } from 'lucide-react';
import { getExpiryStatus } from '../../lib/inventory';
import { formatDateDE } from '../../lib/format';
import type { InventoryItem } from '../../stores/inventoryStore';

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function InventoryItemCard({ item, onEdit, onDelete }: InventoryItemCardProps)
{
  const expiryStatus = getExpiryStatus(item.expiryDate);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription>{item.brand || item.category}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="text-gray-600 hover:text-gray-900"
              title="Bearbeiten"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id, item.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Menge:</span>
          <span className="font-medium">{item.quantity} {item.unit}</span>
        </div>

        {item.expiryDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">MHD: {formatDateDE(item.expiryDate)}</span>
            <div className="flex items-center gap-2">
              {expiryStatus?.status === 'expired' && (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              {expiryStatus?.status === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              )}
              <Badge variant={expiryStatus?.variant}>
                {expiryStatus?.label}
              </Badge>
            </div>
          </div>
        )}

        {item.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {item.location}
          </div>
        )}

        {item.barcode && (
          <div className="text-xs text-gray-500 font-mono">
            Barcode: {item.barcode}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
