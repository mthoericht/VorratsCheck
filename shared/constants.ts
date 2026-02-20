/**
 * Shared constants and types used by both frontend and backend.
 * This file must remain environment-agnostic (no Node or Browser APIs).
 */

export { UNITS, type UnitValue, VALID_UNIT_VALUES } from './units.js';

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
