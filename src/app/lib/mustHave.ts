import { convertFromGivenToBaseUnit, convertFromBaseToGivenUnit, isPresenceOnlyUnit } from './units';

export interface MustHaveItemLike {
  name: string;
  minQuantity: number;
  unit?: string;
}

export interface InventoryItemLike {
  name: string;
  quantity: number;
  unit?: string;
}

export interface MustHaveStockStatus {
  current: number;
  needed: number;
  displayCurrent: number;
  displayNeeded: number;
  displayUnit: string;
  isLow: boolean;
}

/**
 * Compare must-have requirement with inventory by unit: weight→g, volume→ml, countable→same unit.
 * Used by Dashboard and Must-Have list for consistent low-stock count.
 */
export function getStockStatus(
  mustHave: MustHaveItemLike,
  inventory: InventoryItemLike[]
): MustHaveStockStatus 
{
  const inventoryItems = inventory.filter((item) =>
    item.name.toLowerCase().includes(mustHave.name.toLowerCase())
  );
  const needQty = mustHave.minQuantity;
  const needUnit = mustHave.unit || 'stk';
  const preferKind = inventoryItems.length > 0
    ? convertFromGivenToBaseUnit(inventoryItems[0].quantity, inventoryItems[0].unit || 'stk')?.kind
    : undefined;
  const need = (preferKind === 'weight' || preferKind === 'volume')
    ? convertFromGivenToBaseUnit(needQty, needUnit, preferKind)
    : convertFromGivenToBaseUnit(needQty, needUnit);

  if (!need) 
  {
    // Removed/unknown unit: treat as presence-only (match by name only), consistent with recipe matching.
    if (isPresenceOnlyUnit(needUnit))
    {
      const present = inventoryItems.length > 0 ? 1 : 0;
      return {
        current: present,
        needed: 1,
        displayCurrent: present,
        displayNeeded: 1,
        displayUnit: needUnit,
        isLow: inventoryItems.length === 0,
      };
    }
    const total = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
      current: total,
      needed: needQty,
      displayCurrent: total,
      displayNeeded: needQty,
      displayUnit: needUnit,
      isLow: total < needQty,
    };
  }

  if (need.kind === 'weight' || need.kind === 'volume') 
  {
    let totalValue = 0;
    for (const item of inventoryItems) 
    {
      const have = convertFromGivenToBaseUnit(item.quantity, item.unit || 'stk');
      if (have && have.kind === need.kind) totalValue += have.value;
    }
    const displayCurrent = convertFromBaseToGivenUnit(totalValue, needUnit, need.kind) ?? totalValue;
    const displayNeeded = convertFromBaseToGivenUnit(need.value, needUnit, need.kind) ?? need.value;
    return {
      current: totalValue,
      needed: need.value,
      displayCurrent,
      displayNeeded,
      displayUnit: needUnit,
      isLow: totalValue < need.value,
    };
  }

  const sameUnit = (u: string) => (u || '').toLowerCase().trim() === (needUnit || '').toLowerCase().trim();
  const totalCountable = inventoryItems
    .filter((item) => sameUnit(item.unit || 'stk'))
    .reduce((sum, item) => sum + item.quantity, 0);
  return {
    current: totalCountable,
    needed: needQty,
    displayCurrent: totalCountable,
    displayNeeded: needQty,
    displayUnit: needUnit,
    isLow: totalCountable < needQty,
  };
}
