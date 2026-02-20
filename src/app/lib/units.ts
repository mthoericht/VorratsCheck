/**
 * Units for inventory and recipes: UI list + conversion for matching.
 * Weight → grams (g), volume → milliliters (ml).
 * Countable units (Stück, Zehen, etc.) are compared only when the same unit is used.
 */

import { UNITS, type UnitValue } from '@shared/units';
export { UNITS, type UnitValue };

/** Display label for a unit value (e.g. stk → Stück). */
export function getUnitLabel(unit: string | null | undefined): string
{
  if (!unit) return 'Stück';
  return UNITS.find((u) => u.value === unit)?.label ?? unit;
}

// --- Conversion for inventory–recipe matching ---

export type CompareKind = 'weight' | 'volume' | 'countable';

/** Unit factor to grams (for weight). 1 Prise/pr = 0.5 g for matching. */
const UNIT_TO_GRAM: Record<string, number> = {
  g: 1,
  kg: 1000,
  el: 2,
  tl: 0.5,
  prise: 0.5,
  pr: 0.5
};

/** Unit factor to milliliters (for volume). */
const UNIT_TO_ML: Record<string, number> = {
  ml: 1,
  liter: 1000,
  l: 1000,
  el: 5,
  tl: 2,
};

/** Countable units (no conversion; compare only when same unit). Includes legacy values. */
const COUNTABLE_UNITS = new Set([
  'stk', 'stück', 'zehen', 'kugeln', 'dose', 'packung',
]);

/** Normalized UNITS values for lookup (lowercase). */
const NORMALIZED_UNIT_VALUES = new Set(UNITS.map((u) => u.value.toLowerCase().trim()));

/**
 * Returns true if the unit is not in UNITS (constants). For such units, recipe matching
 * only checks "ingredient present in inventory", not quantity (e.g. removed or legacy units).
 */
export function isPresenceOnlyUnit(unit: string): boolean 
{
  const normalized = normalizeUnit(unit);
  return normalized !== '' && !NORMALIZED_UNIT_VALUES.has(normalized);
}

/** Normalizes a unit string to lowercase and trimmed. */
function normalizeUnit(unit: string): string 
{
  return (unit || '').toLowerCase().trim();
}

/**
 * Returns the comparison kind and value in base unit (g or ml),
 * or the raw value for countable units.
 * When the unit is ambiguous (e.g. Becher, Glas: both weight and volume),
 * preferKind selects which interpretation to use (e.g. from inventory).
 */
export function convertFromGivenToBaseUnit(
  quantity: number,
  unit: string,
  preferKind?: 'weight' | 'volume'
): { kind: CompareKind; value: number } | null 
{
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  const normalizedUnit = normalizeUnit(unit);
  if (!normalizedUnit) return null;

  const gram = UNIT_TO_GRAM[normalizedUnit];
  const ml = UNIT_TO_ML[normalizedUnit];

  if (preferKind === 'volume' && ml != null) 
  {
    return { kind: 'volume', value: quantity * ml };
  }
  if (preferKind === 'weight' && gram != null) 
  {
    return { kind: 'weight', value: quantity * gram };
  }

  if (gram != null) 
  {
    return { kind: 'weight', value: quantity * gram };
  }
  if (ml != null) 
  {
    return { kind: 'volume', value: quantity * ml };
  }

  if (COUNTABLE_UNITS.has(normalizedUnit)) 
  {
    return { kind: 'countable', value: quantity };
  }

  return null;
}

/**
 * Converts a value from base unit (g or ml) to the given unit for display.
 */
export function convertFromBaseToGivenUnit(valueInBase: number, unit: string, kind: 'weight' | 'volume'): number | null 
{
  const normalizedUnit = normalizeUnit(unit);

  if (kind === 'weight') 
  {
    const factor = UNIT_TO_GRAM[normalizedUnit];
    if (factor == null) return null;
    return valueInBase / factor;
  }

  const factor = UNIT_TO_ML[normalizedUnit];
  if (factor == null) return null;
  return valueInBase / factor;
}

/**
 * Returns whether the available quantity (inventory) covers the required quantity (recipe).
 * Weight is compared in grams, volume in milliliters; countable units only when same unit.
 * Ambiguous units (Becher, Glas, Tube, EL, TL) are interpreted like the inventory:
 * e.g. "1 Becher" → 200 ml when inventory is in ml, 200 g when inventory is in g.
 */
export function quantityCovers(haveQuantity: number, haveUnit: string, needQuantity: number, needUnit: string): boolean 
{
  const have = convertFromGivenToBaseUnit(haveQuantity, haveUnit);
  if (!have) return false;

  const preferKind = have.kind === 'weight' || have.kind === 'volume' ? have.kind : undefined;
  const need = convertFromGivenToBaseUnit(needQuantity, needUnit, preferKind);
  if (!need) return false;

  if (need.kind === 'weight' && have.kind === 'weight') 
  {
    return have.value >= need.value;
  }
  if (need.kind === 'volume' && have.kind === 'volume') 
  {
    return have.value >= need.value;
  }
  if (need.kind === 'countable' && have.kind === 'countable') 
  {
    const uNeed = normalizeUnit(needUnit);
    const uHave = normalizeUnit(haveUnit);
    return uNeed === uHave && haveQuantity >= needQuantity;
  }
  return false;
}
