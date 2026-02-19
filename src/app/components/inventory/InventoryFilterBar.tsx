import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export interface InventoryFilterBarOption {
  value: string;
  label: string;
}

interface InventoryFilterBarProps {
  /** Optional label shown before the chips (e.g. "Kategorie", "Lagerort") */
  label?: string;
  /** Options for the filter. Use value "all" for the "Alle" option or pass allLabel. */
  options: InventoryFilterBarOption[];
  /** Currently selected value (e.g. "all" or one of options[].value) */
  value: string;
  /** Called when user selects an option */
  onChange: (value: string) => void;
  /** Label for the "show all" option. If not set, no "all" chip is shown unless in options. */
  allLabel?: string;
  className?: string;
}

/**
 * Filter bar for inventory (e.g. location). Shows "Alle" and options as clickable chips.
 */
export function InventoryFilterBar({
  label,
  options,
  value,
  onChange,
  allLabel = 'Alle',
  className,
}: InventoryFilterBarProps)
{
  const hasAll = allLabel != null;
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {label && (
        <span className="text-sm font-medium text-muted-foreground shrink-0">
          {label}
        </span>
      )}
      {hasAll && (
        <Button
          variant={value === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('all')}
        >
          {allLabel}
        </Button>
      )}
      {options.map(opt => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
