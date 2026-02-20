/**
 * Shared unit definitions used by both frontend and backend.
 * This file must remain environment-agnostic (no Node or Browser APIs).
 */

export const UNITS = [
  { value: 'stk', label: 'Stück' },
  { value: 'g', label: 'Gramm' },
  { value: 'kg', label: 'Kilogramm' },
  { value: 'ml', label: 'Milliliter' },
  { value: 'l', label: 'Liter' },
  { value: 'EL', label: 'Esslöffel' },
  { value: 'TL', label: 'Teelöffel' },
  { value: 'pr', label: 'Prise' }
] as const;

export type UnitValue = (typeof UNITS)[number]['value'];

export const VALID_UNIT_VALUES = UNITS.map(u => u.value) as string[];
