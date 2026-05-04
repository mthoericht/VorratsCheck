import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { InventoryFilterBar } from './InventoryFilterBar';
import { useTranslation } from '../../lib/i18n';
import { Box } from '@mui/material';

interface InventoryFilterProps {
  locationOptions: readonly { value: string; id: string }[];
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
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 3,
        rowGap: 1.5,
      }}
    >
      <InventoryFilterBar
        label={t('inventory.filterLocation')}
        options={locationOptions.map(opt => ({ value: opt.value, label: t(`inventory.locations.${opt.id}`) }))}
        value={filterLocation}
        onChange={onLocationChange}
        allLabel={t('common.all')}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Label htmlFor="filter-category" className="text-sm font-medium text-muted-foreground shrink-0">
          {t('inventory.filterCategory')}
        </Label>
        <Select value={filterCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="filter-category" className="w-[180px]" size="sm">
            <SelectValue placeholder={t('common.all')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {filterCategories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
    </Box>
  );
}
