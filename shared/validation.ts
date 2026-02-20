/**
 * Shared validation helpers used by both frontend and backend.
 * This file must remain environment-agnostic (no Node or Browser APIs).
 */

import {
  VALID_UNIT_VALUES,
  VALID_PRIORITY_VALUES,
  VALID_WISHLIST_TYPE_VALUES,
  VALID_DIFFICULTY_VALUES,
  type Priority,
  type WishlistType,
  type Difficulty,
} from './constants.js';

export function isValidNumber(value: unknown): value is number
{
  const n = Number(value);
  return !Number.isNaN(n) && Number.isFinite(n);
}

export function toPositiveNumber(value: unknown, fallback: number): number
{
  const n = Number(value);
  if (Number.isNaN(n) || !Number.isFinite(n) || n < 0) return fallback;
  return n;
}

export function isValidDate(value: unknown): boolean
{
  if (typeof value !== 'string' || !value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export function isValidUnit(value: unknown): boolean
{
  return typeof value === 'string' && VALID_UNIT_VALUES.includes(value);
}

export function isValidPriority(value: unknown): value is Priority
{
  return typeof value === 'string' && VALID_PRIORITY_VALUES.includes(value);
}

export function isValidWishlistType(value: unknown): value is WishlistType
{
  return typeof value === 'string' && (VALID_WISHLIST_TYPE_VALUES as readonly string[]).includes(value);
}

export function isValidDifficulty(value: unknown): value is Difficulty
{
  return typeof value === 'string' && VALID_DIFFICULTY_VALUES.includes(value);
}
