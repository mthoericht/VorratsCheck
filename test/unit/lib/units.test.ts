import { describe, it, expect } from 'vitest';
import {
  convertFromGivenToBaseUnit,
  convertFromBaseToGivenUnit,
  quantityCovers,
  UNITS,
} from '@/app/lib/units';

describe('units', () => 
{
  describe('UNITS', () => 
  {
    it('includes common units', () => 
    {
      const values = UNITS.map((u) => u.value);
      expect(values).toContain('g');
      expect(values).toContain('kg');
      expect(values).toContain('ml');
      expect(values).toContain('Stück');
    });
  });

  describe('convertFromGivenToBaseUnit', () => 
  {
    it('converts weight (g) to base', () => 
    {
      const result = convertFromGivenToBaseUnit(500, 'g');
      expect(result).toEqual({ kind: 'weight', value: 500 });
    });

    it('converts weight (kg) to grams', () => 
    {
      const result = convertFromGivenToBaseUnit(2, 'kg');
      expect(result).toEqual({ kind: 'weight', value: 2000 });
    });

    it('converts volume (ml) to base', () => 
    {
      const result = convertFromGivenToBaseUnit(250, 'ml');
      expect(result).toEqual({ kind: 'volume', value: 250 });
    });

    it('converts volume (l) to milliliters', () => 
    {
      const result = convertFromGivenToBaseUnit(1, 'l');
      expect(result).toEqual({ kind: 'volume', value: 1000 });
    });

    it('returns countable for Stück', () => 
    {
      const result = convertFromGivenToBaseUnit(3, 'Stück');
      expect(result).toEqual({ kind: 'countable', value: 3 });
    });

    it('normalizes unit case', () => 
    {
      expect(convertFromGivenToBaseUnit(1, 'KG')).toEqual({ kind: 'weight', value: 1000 });
      expect(convertFromGivenToBaseUnit(1, 'L')).toEqual({ kind: 'volume', value: 1000 });
    });

    it('returns null for invalid quantity', () => 
    {
      expect(convertFromGivenToBaseUnit(-1, 'g')).toBeNull();
      expect(convertFromGivenToBaseUnit(NaN, 'g')).toBeNull();
    });

    it('returns null for unknown unit', () => 
    {
      expect(convertFromGivenToBaseUnit(1, 'unknown')).toBeNull();
    });
  });

  describe('convertFromBaseToGivenUnit', () => 
  {
    it('converts grams to kg', () => 
    {
      expect(convertFromBaseToGivenUnit(2000, 'kg', 'weight')).toBe(2);
    });

    it('converts milliliters to l', () => 
    {
      expect(convertFromBaseToGivenUnit(1000, 'l', 'volume')).toBe(1);
    });

    it('returns null for non-matching kind and unit', () => 
    {
      expect(convertFromBaseToGivenUnit(100, 'ml', 'weight')).toBeNull();
    });
  });

  describe('quantityCovers', () => 
  {
    it('compares weight: have more than need', () => 
    {
      expect(quantityCovers(500, 'g', 200, 'g')).toBe(true);
      expect(quantityCovers(1, 'kg', 500, 'g')).toBe(true);
    });

    it('compares weight: have less than need', () => 
    {
      expect(quantityCovers(100, 'g', 500, 'g')).toBe(false);
    });

    it('compares volume: have more than need', () => 
    {
      expect(quantityCovers(1, 'l', 500, 'ml')).toBe(true);
    });

    it('compares countable same unit', () => 
    {
      expect(quantityCovers(3, 'Stück', 2, 'Stück')).toBe(true);
      expect(quantityCovers(2, 'Stück', 3, 'Stück')).toBe(false);
    });

    it('countable different units do not cover', () => 
    {
      expect(quantityCovers(5, 'Stück', 2, 'Dose')).toBe(false);
    });

    it('returns false when types differ', () => 
    {
      expect(quantityCovers(100, 'g', 100, 'ml')).toBe(false);
    });
  });
});
