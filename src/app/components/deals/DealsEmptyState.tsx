import { Card } from '../ui/card';
import { TrendingDown } from 'lucide-react';

export function DealsEmptyState() 
{
  return (
    <Card className="p-12 text-center">
      <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Keine passenden Angebote gefunden</p>
      <p className="text-sm text-gray-400 mt-2">
        Versuchen Sie, Artikel zu Ihrer Must-Have oder Wunschliste hinzuzufügen
      </p>
    </Card>
  );
}
