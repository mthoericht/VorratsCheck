import { describe, it, expect } from 'vitest';
import { getStockStatus } from '@/app/lib/mustHave';

describe('mustHave', () => 
{
  describe('getStockStatus', () => 
  {
    it('reports low when no matching inventory', () => 
    {
      const status = getStockStatus(
        { name: 'Milch', minQuantity: 2, unit: 'l' },
        []
      );
      expect(status.isLow).toBe(true);
      expect(status.current).toBe(0);
      expect(status.displayNeeded).toBe(2);
      expect(status.displayUnit).toBe('l');
    });

    it('reports sufficient when inventory covers (weight)', () => 
    {
      const status = getStockStatus(
        { name: 'Mehl', minQuantity: 1000, unit: 'g' },
        [
          { name: 'Mehl', quantity: 500, unit: 'g' },
          { name: 'Mehl', quantity: 600, unit: 'g' },
        ]
      );
      expect(status.isLow).toBe(false);
      expect(status.current).toBe(1100);
      expect(status.needed).toBe(1000);
    });

    it('reports low when inventory does not cover (weight)', () => 
    {
      const status = getStockStatus(
        { name: 'Mehl', minQuantity: 1000, unit: 'g' },
        [{ name: 'Mehl', quantity: 500, unit: 'g' }]
      );
      expect(status.isLow).toBe(true);
    });

    it('handles countable same unit', () => 
    {
      const status = getStockStatus(
        { name: 'Eier', minQuantity: 6, unit: 'stk' },
        [{ name: 'Eier', quantity: 10, unit: 'stk' }]
      );
      expect(status.isLow).toBe(false);
      expect(status.displayCurrent).toBe(10);
      expect(status.displayNeeded).toBe(6);
    });

    it('handles countable low', () => 
    {
      const status = getStockStatus(
        { name: 'Joghurt', minQuantity: 4, unit: 'stk' },
        [{ name: 'Joghurt', quantity: 2, unit: 'stk' }]
      );
      expect(status.isLow).toBe(true);
    });

    it('treats removed/unknown units as presence-only (match by name only)', () => 
    {
      const statusPresent = getStockStatus(
        { name: 'Milch', minQuantity: 2, unit: 'Becher' },
        [{ name: 'Milch', quantity: 500, unit: 'ml' }]
      );
      expect(statusPresent.isLow).toBe(false);
      expect(statusPresent.displayCurrent).toBe(1);
      expect(statusPresent.displayNeeded).toBe(1);
      expect(statusPresent.displayUnit).toBe('Becher');

      const statusAbsent = getStockStatus(
        { name: 'Sahne', minQuantity: 1, unit: 'Glas' },
        []
      );
      expect(statusAbsent.isLow).toBe(true);
      expect(statusAbsent.displayCurrent).toBe(0);
      expect(statusAbsent.displayNeeded).toBe(1);
    });
  });
});
