import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getExpiryStatus, INVENTORY_LOCATION_OPTIONS } from '@/app/lib/inventory';

describe('inventory', () => 
{
  describe('INVENTORY_LOCATION_OPTIONS', () => 
  {
    it('has expected location options', () => 
    {
      expect(INVENTORY_LOCATION_OPTIONS.length).toBeGreaterThan(0);
      expect(INVENTORY_LOCATION_OPTIONS.some((o) => o.value === 'Kühlschrank')).toBe(true);
    });
  });

  describe('getExpiryStatus', () => 
  {
    const fixedDate = new Date('2025-02-15T12:00:00.000Z');

    beforeEach(() => 
    {
      vi.useFakeTimers();
      vi.setSystemTime(fixedDate);
    });

    afterEach(() => 
    {
      vi.useRealTimers();
    });

    it('returns null when no expiry date', () => 
    {
      expect(getExpiryStatus(undefined)).toBeNull();
      expect(getExpiryStatus('')).toBeNull();
    });

    it('returns expired for past date', () => 
    {
      const result = getExpiryStatus('2025-02-10');
      expect(result?.status).toBe('expired');
      expect(result?.daysUntilExpiry).toBeLessThan(0);
      expect(result?.variant).toBe('destructive');
    });

    it('returns warning for within 7 days', () => 
    {
      const result = getExpiryStatus('2025-02-18');
      expect(result?.status).toBe('warning');
      expect(result?.variant).toBe('outline');
      expect(result?.daysUntilExpiry).toBeGreaterThanOrEqual(0);
      expect(result?.daysUntilExpiry).toBeLessThanOrEqual(7);
    });

    it('returns ok for more than 7 days', () => 
    {
      const result = getExpiryStatus('2025-03-01');
      expect(result?.status).toBe('ok');
      expect(result?.variant).toBe('secondary');
      expect(result?.daysUntilExpiry).toBeGreaterThan(7);
    });
  });
});
