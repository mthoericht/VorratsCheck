import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UNITS } from '../lib/units';
import { cn } from './ui/utils';
import { useTranslation } from '../lib/i18n';

interface QuantityProps {
  /** Current quantity (empty = optional) */
  quantity: string | number;
  /** Current unit */
  unit: string;
  /** Callback on change (quantity as number or empty for optional) */
  onQuantityChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  /** Label (e.g. "Menge") */
  label?: string;
  /** Placeholder for quantity field */
  placeholder?: string;
  /** Optional – not a required field */
  optional?: boolean;
  /** ID prefix for access (e.g. "add" → id "add-quantity") */
  idPrefix?: string;
  /** Compact mode (e.g. in lists) */
  compact?: boolean;
  className?: string;
}

/**
 * Combined quantity and unit input field (inventory, recipe ingredients).
 */
export function Quantity({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  label,
  placeholder,
  optional = true,
  idPrefix = 'quantity',
  compact = false,
  className,
}: QuantityProps) 
{
  const { t } = useTranslation();
  const effectiveLabel = label ?? t('common.quantity');
  const effectivePlaceholder = placeholder ?? t('inventory.quantityPlaceholder');
  const qtyStr = typeof quantity === 'number' ? (quantity === 0 ? '' : String(quantity)) : quantity;
  const idQty = idPrefix ? `${idPrefix}-quantity` : 'quantity';
  const idUnit = idPrefix ? `${idPrefix}-unit` : 'unit';

  const unitOptions = UNITS.map((u) => (
    <SelectItem key={u.value} value={u.value}>
      {t(`units.${u.value}`)}
    </SelectItem>
  ));

  if (compact) 
  {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Input
          id={idQty}
          type="number"
          step="0.01"
          min={0}
          value={qtyStr}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder="–"
          className="w-20"
        />
        <Select value={unit || 'stk'} onValueChange={onUnitChange}>
          <SelectTrigger id={idUnit} className="w-28" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{unitOptions}</SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <div>
        <Label htmlFor={idQty}>
          {effectiveLabel}
          {optional ? null : ' *'}
        </Label>
        <Input
          id={idQty}
          type="number"
          step="0.01"
          min={0}
          value={qtyStr}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder={effectivePlaceholder}
        />
      </div>
      <div>
        <Label htmlFor={idUnit}>{t('common.unit')}</Label>
        <Select value={unit || 'stk'} onValueChange={onUnitChange}>
          <SelectTrigger id={idUnit}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{unitOptions}</SelectContent>
        </Select>
      </div>
    </div>
  );
}
