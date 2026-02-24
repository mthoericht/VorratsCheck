import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WishlistStats } from '@/app/components/wishlist/WishlistStats';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { WishListItem } from '@/app/stores/wishlistStore';

describe('WishlistStats', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders total and priority counts', () => 
  {
    const items: WishListItem[] = [
      { id: '1', name: 'A', type: 'specific', priority: 'high' },
      { id: '2', name: 'B', type: 'specific', priority: 'high' },
      { id: '3', name: 'C', type: 'specific', priority: 'medium' },
      { id: '4', name: 'D', type: 'specific', priority: 'low' },
    ];
    render(<WishlistStats items={items} />);
    expect(screen.getByText('Gesamt')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Hohe Priorität')).toBeInTheDocument();
    expect(screen.getByText('Mittlere Priorität')).toBeInTheDocument();
    expect(screen.getByText('Niedrige Priorität')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument(); // total
    expect(screen.getByText('2')).toBeInTheDocument(); // high count
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1); // medium and/or low
  });

  it('renders zeros when items is empty', () => 
  {
    render(<WishlistStats items={[]} />);
    expect(screen.getByText('Gesamt')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });
});
