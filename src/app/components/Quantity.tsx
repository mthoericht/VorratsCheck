import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UNITS } from '../lib/units';
import { cn } from './ui/utils';

interface QuantityProps {
  /** Aktuelle Menge (leer = optional) */
  quantity: string | number;
  /** Aktuelle Einheit */
  unit: string;
  /** Callback bei Änderung (quantity als Zahl oder leer für optional) */
  onQuantityChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  /** Label (z. B. "Menge") */
  label?: string;
  /** Placeholder für Mengenfeld */
  placeholder?: string;
  /** Optional – kein Pflichtfeld */
  optional?: boolean;
  /** Id-Prefix für Zugriff (z. B. "add" → id "add-quantity") */
  idPrefix?: string;
  /** Kompakter Modus (z. B. in Listen) */
  compact?: boolean;
  className?: string;
}

/**
 * Kombiniertes Mengen- und Einheitenfeld (Vorrat, Rezept-Zutaten).
 */
export function Quantity({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  label = 'Menge',
  placeholder = 'Optional (Standard: 1 Stück)',
  optional = true,
  idPrefix = 'quantity',
  compact = false,
  className,
}: QuantityProps) 
{
  const qtyStr = typeof quantity === 'number' ? (quantity === 0 ? '' : String(quantity)) : quantity;
  const idQty = idPrefix ? `${idPrefix}-quantity` : 'quantity';
  const idUnit = idPrefix ? `${idPrefix}-unit` : 'unit';

  const unitOptions = UNITS.map((u) => (
    <SelectItem key={u.value} value={u.value}>
      {u.label}
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
        <Select value={unit || 'Stück'} onValueChange={onUnitChange}>
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
          {label}
          {optional ? null : ' *'}
        </Label>
        <Input
          id={idQty}
          type="number"
          step="0.01"
          min={0}
          value={qtyStr}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div>
        <Label htmlFor={idUnit}>Einheit</Label>
        <Select value={unit || 'Stück'} onValueChange={onUnitChange}>
          <SelectTrigger id={idUnit}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{unitOptions}</SelectContent>
        </Select>
      </div>
    </div>
  );
}
