import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle } from 'lucide-react';

export interface ExpiredItem {
  id: string;
  name: string;
  expiryDate?: string;
}

interface ExpiredItemsCardProps {
  items: ExpiredItem[];
}

export function ExpiredItemsCard({ items }: ExpiredItemsCardProps) 
{
  if (items.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="w-5 h-5" />
          Abgelaufene Artikel
        </CardTitle>
        <CardDescription>Diese Artikel sind bereits abgelaufen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Abgelaufen: {item.expiryDate}</p>
              </div>
              <Badge variant="destructive">Abgelaufen</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
