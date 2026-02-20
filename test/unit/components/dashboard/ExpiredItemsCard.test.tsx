import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpiredItemsCard } from '@/app/components/dashboard/ExpiredItemsCard';

describe('ExpiredItemsCard', () => 
{
  it('renders nothing when items is empty', () => 
  {
    const { container } = render(<ExpiredItemsCard items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders card with items when items provided', () => 
  {
    const items = [
      { id: '1', name: 'Joghurt', expiryDate: '2025-01-15' },
    ];
    render(<ExpiredItemsCard items={items} />);
    expect(screen.getByText('Abgelaufene Artikel')).toBeInTheDocument();
    expect(screen.getByText('Joghurt')).toBeInTheDocument();
    expect(screen.getByText(/15\.01\.2025/)).toBeInTheDocument();
  });
});
