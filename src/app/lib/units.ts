/**
 * Units for inventory and recipes: UI list + conversion for matching.
 * Weight → grams (g), volume → milliliters (ml).
 * Countable units (Stück, Zehen, etc.) are compared only when the same unit is used.
 */

/** Units for dropdowns (value → label). */
export const UNITS = [
  { value: 'Stück', label: 'Stück' },
  { value: 'g', label: 'Gramm' },
  { value: 'kg', label: 'Kilogramm' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'Liter', label: 'Liter' },
  { value: 'Dose', label: 'Dose' },
  { value: 'Packung', label: 'Packung' },
  { value: 'EL', label: 'EL' },
  { value: 'TL', label: 'TL' },
  { value: 'Zehen', label: 'Zehen' },
  { value: 'Prise', label: 'Prise' },
  { value: 'Kugeln', label: 'Kugeln' },
] as const;

export type UnitValue = (typeof UNITS)[number]['value'];

// --- Conversion for inventory–recipe matching ---

export type CompareKind = 'weight' | 'volume' | 'countable';

/** Unit factor to grams (for weight). */
const UNIT_TO_GRAM: Record<string, number> = {
  g: 1,
  kg: 1000,
};

/** Unit factor to milliliters (for volume). */
const UNIT_TO_ML: Record<string, number> = {
  ml: 1,
  liter: 1000,
  l: 1000,
  el: 15,
  tl: 5,
};

/** Countable units (no conversion; compare only when same unit). */
const COUNTABLE_UNITS = new Set([
  'stück', 'zehen', 'prise', 'kugeln', 'dose', 'packung',
]);

function normalizeUnit(unit: string): string 
{
  return (unit || '').toLowerCase().trim();
}

/**
 * Returns the comparison kind and value in base unit (g or ml),
 * or the raw value for countable units.
 */
export function toComparable(quantity: number, unit: string): { kind: CompareKind; value: number } | null 
{
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  const u = normalizeUnit(unit);
  if (!u) return null;

  const gram = UNIT_TO_GRAM[u];
  if (gram != null) 
  {
    return { kind: 'weight', value: quantity * gram };
  }

  const ml = UNIT_TO_ML[u];
  if (ml != null) 
  {
    return { kind: 'volume', value: quantity * ml };
  }

  if (COUNTABLE_UNITS.has(u)) 
  {
    return { kind: 'countable', value: quantity };
  }
  return null;
}

/**
 * Returns whether the available quantity (inventory) covers the required quantity (recipe).
 * Weight is compared in grams, volume in milliliters; countable units only when same unit.
 */
export function quantityCovers(haveQuantity: number, haveUnit: string, needQuantity: number, needUnit: string): boolean 
{
  const need = toComparable(needQuantity, needUnit);
  const have = toComparable(haveQuantity, haveUnit);
  
  if (!need || !have) return false;

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
