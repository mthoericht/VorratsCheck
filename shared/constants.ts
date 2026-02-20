/**
 * Shared constants and types used by both frontend and backend.
 * This file must remain environment-agnostic (no Node or Browser APIs).
 */

// --- Units ---

export const UNITS = [
  { value: 'Stück', label: 'Stück' },
  { value: 'g', label: 'Gramm' },
  { value: 'kg', label: 'Kilogramm' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'Liter', label: 'Liter' },
  { value: 'Dose', label: 'Dose' },
  { value: 'Packung', label: 'Packung' },
  { value: 'Flasche', label: 'Flasche' },
  { value: 'Beutel', label: 'Beutel' },
  { value: 'Becher', label: 'Becher' },
  { value: 'Glas', label: 'Glas' },
  { value: 'Tube', label: 'Tube' },
  { value: 'Bund', label: 'Bund' },
  { value: 'EL', label: 'EL' },
  { value: 'TL', label: 'TL' },
  { value: 'Prise', label: 'Prise' },
  { value: 'Scheibe', label: 'Scheibe' },
  { value: 'Zehen', label: 'Zehen' },
  { value: 'Kugeln', label: 'Kugeln' },
] as const;

export type UnitValue = (typeof UNITS)[number]['value'];

export const VALID_UNIT_VALUES = UNITS.map(u => u.value) as string[];

// --- Priorities ---

export const PRIORITIES = [
  { value: 'low', label: 'Niedrig' },
  { value: 'medium', label: 'Mittel' },
  { value: 'high', label: 'Hoch' },
] as const;

export type Priority = (typeof PRIORITIES)[number]['value'];

export const VALID_PRIORITY_VALUES = PRIORITIES.map(p => p.value) as string[];

// --- Wishlist types ---

export const WISHLIST_TYPES = ['category', 'specific'] as const;

export type WishlistType = (typeof WISHLIST_TYPES)[number];

export const VALID_WISHLIST_TYPE_VALUES = WISHLIST_TYPES as readonly string[];

// --- Difficulties ---

export const DIFFICULTIES = [
  { value: 'easy', label: 'Leicht' },
  { value: 'medium', label: 'Mittel' },
  { value: 'hard', label: 'Schwer' },
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number]['value'];

export const VALID_DIFFICULTY_VALUES = DIFFICULTIES.map(d => d.value) as string[];

// --- Inventory locations ---

export const INVENTORY_LOCATIONS = [
  { value: 'Kühlschrank', label: 'Kühlschrank' },
  { value: 'Gefrierschrank', label: 'Gefrierschrank' },
  { value: 'Vorratsschrank', label: 'Vorratsschrank' },
] as const;

export type InventoryLocation = (typeof INVENTORY_LOCATIONS)[number]['value'];
