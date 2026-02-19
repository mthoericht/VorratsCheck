import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { Package, ListChecks, Heart } from 'lucide-react';

export function QuickActionsCard() 
{
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnellzugriff</CardTitle>
        <CardDescription>Häufig verwendete Funktionen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/inventory">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Package className="w-4 h-4" />
              Artikel hinzufügen
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="outline" className="w-full justify-start gap-2">
              <ListChecks className="w-4 h-4" />
              Rezepte finden
            </Button>
          </Link>
          <Link to="/deals">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Heart className="w-4 h-4" />
              Angebote ansehen
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
