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
        { name: 'Eier', minQuantity: 6, unit: 'Stück' },
        [{ name: 'Eier', quantity: 10, unit: 'Stück' }]
      );
      expect(status.isLow).toBe(false);
      expect(status.displayCurrent).toBe(10);
      expect(status.displayNeeded).toBe(6);
    });

    it('handles countable low', () => 
    {
      const status = getStockStatus(
        { name: 'Joghurt', minQuantity: 4, unit: 'Stück' },
        [{ name: 'Joghurt', quantity: 2, unit: 'Stück' }]
      );
      expect(status.isLow).toBe(true);
    });
  });
});
