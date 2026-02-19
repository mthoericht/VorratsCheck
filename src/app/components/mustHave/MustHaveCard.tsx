import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import type { MustHaveItem } from '../../stores/mustHaveStore';

export interface MustHaveStockStatus {
  current: number;
  needed: number;
  displayCurrent: number;
  displayNeeded: number;
  displayUnit: string;
  isLow: boolean;
}

interface MustHaveCardProps {
  item: MustHaveItem;
  status: MustHaveStockStatus;
  onEdit: (item: MustHaveItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function MustHaveCard({ item, status, onEdit, onDelete }: MustHaveCardProps) 
{
  return (
    <Card className={status.isLow ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {status.isLow ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {item.name}
            </CardTitle>
            <CardDescription>
              {item.category && <span className="text-muted-foreground">{item.category}</span>}
              {item.category && ' · '}
              {status.isLow ? 'Nachkaufen erforderlich' : 'Ausreichend vorhanden'}
            </CardDescription>
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
              className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 w-8 p-0"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Aktueller Bestand:</span>
          <Badge variant={status.isLow ? 'destructive' : 'default'}>
            {Number(status.displayCurrent).toLocaleString('de-DE', { maximumFractionDigits: 1 })} / {Number(status.displayNeeded).toLocaleString('de-DE', { maximumFractionDigits: 1 })}{status.displayUnit ? ` ${status.displayUnit}` : ''}
          </Badge>
        </div>
        {status.isLow && (
          <div className="text-sm text-red-600 font-medium">
            Noch {Math.max(0, Number(status.displayNeeded) - Number(status.displayCurrent)).toLocaleString('de-DE', { maximumFractionDigits: 1 })}{status.displayUnit ? ` ${status.displayUnit}` : ''} benötigt
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              status.isLow ? 'bg-red-600' : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(100, (status.current / status.needed) * 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
