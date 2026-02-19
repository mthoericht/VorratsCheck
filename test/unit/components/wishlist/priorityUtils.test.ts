import { describe, it, expect } from 'vitest';
import { getPriorityColor, getPriorityLabel } from '@/app/components/wishlist/priorityUtils';

describe('priorityUtils', () => 
{
  describe('getPriorityColor', () => 
  {
    it('returns correct classes for high/medium/low', () => 
    {
      expect(getPriorityColor('high')).toContain('red');
      expect(getPriorityColor('medium')).toContain('yellow');
      expect(getPriorityColor('low')).toContain('green');
    });
  });

  describe('getPriorityLabel', () => 
  {
    it('returns German labels', () => 
    {
      expect(getPriorityLabel('high')).toBe('Hoch');
      expect(getPriorityLabel('medium')).toBe('Mittel');
      expect(getPriorityLabel('low')).toBe('Niedrig');
    });
  });
});
