import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n';
import { Box } from '@mui/material';

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
  allLabel,
  className,
}: InventoryFilterBarProps)
{
  const { t } = useTranslation();
  const resolvedAllLabel = allLabel ?? t('common.all');
  const hasAll = resolvedAllLabel != null;
  return (
    <Box
      className={className}
      sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}
    >
      {label && (
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted-foreground)', flexShrink: 0 }}>
          {label}
        </span>
      )}
      {hasAll && (
        <Button
          variant={value === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('all')}
        >
          {resolvedAllLabel}
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
    </Box>
  );
}
