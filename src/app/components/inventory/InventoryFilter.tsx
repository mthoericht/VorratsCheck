import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { InventoryFilterBar } from './InventoryFilterBar';

interface InventoryFilterProps {
  locationOptions: { value: string; label: string }[];
  filterLocation: string;
  onLocationChange: (value: string) => void;
  filterCategories: string[];
  filterCategory: string;
  onCategoryChange: (value: string) => void;
}

export function InventoryFilter({
  locationOptions,
  filterLocation,
  onLocationChange,
  filterCategories,
  filterCategory,
  onCategoryChange,
}: InventoryFilterProps)
{
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <InventoryFilterBar
        label="Lagerort"
        options={locationOptions}
        value={filterLocation}
        onChange={onLocationChange}
        allLabel="Alle"
      />
      <div className="flex items-center gap-2">
        <Label htmlFor="filter-category" className="text-sm font-medium text-muted-foreground shrink-0">
          Kategorie
        </Label>
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="filter-category" className="w-[180px]" size="sm">
            <SelectValue placeholder="Alle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {filterCategories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
