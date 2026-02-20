import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { DealsFilterType } from '../../hooks/useDealsPage';

interface DealsFilterBarProps {
  filterType: DealsFilterType;
  setFilterType: (type: DealsFilterType) => void;
  mustHaveCount: number;
  wishListCount: number;
}

export function DealsFilterBar({ filterType, setFilterType, mustHaveCount, wishListCount }: DealsFilterBarProps) 
{
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Button
        variant={filterType === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('all')}
      >
        Alle Angebote
      </Button>
      <Button
        variant={filterType === 'mustHave' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('mustHave')}
        className="gap-2"
      >
        Must-Have
        {mustHaveCount > 0 && (
          <Badge variant="secondary" className="ml-1">{mustHaveCount}</Badge>
        )}
      </Button>
      <Button
        variant={filterType === 'wishList' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterType('wishList')}
        className="gap-2"
      >
        Wunschliste
        {wishListCount > 0 && (
          <Badge variant="secondary" className="ml-1">{wishListCount}</Badge>
        )}
      </Button>
    </div>
  );
}
