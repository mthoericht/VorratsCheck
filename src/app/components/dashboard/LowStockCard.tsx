import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { ListChecks } from 'lucide-react';

export interface LowStockItem {
  id: string;
  name: string;
  minQuantity: number;
}

interface LowStockCardProps {
  items: LowStockItem[];
}

export function LowStockCard({ items }: LowStockCardProps) 
{
  if (items.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900">
          <ListChecks className="w-5 h-5" />
          Niedriger Bestand
        </CardTitle>
        <CardDescription>Diese Must-Have Artikel sollten nachgekauft werden</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Min. Menge: {item.minQuantity}</p>
              </div>
              <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                Nachkaufen
              </Badge>
            </div>
          ))}
        </div>
        <Link to="/must-have">
          <Button variant="outline" className="w-full mt-4">
            Zur Must-Have Liste
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
