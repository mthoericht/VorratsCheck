import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpiringSoonCard } from '@/app/components/dashboard/ExpiringSoonCard';

describe('ExpiringSoonCard', () => 
{
  it('renders nothing when items is empty', () => 
  {
    const { container } = render(<ExpiringSoonCard items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders card with items and limits display by maxItems', () => 
  {
    const items = [
      { id: '1', name: 'Milch', expiryDate: '2025-03-01' },
      { id: '2', name: 'Käse', expiryDate: '2025-03-02' },
      { id: '3', name: 'Joghurt', expiryDate: '2025-03-03' },
    ];
    render(<ExpiringSoonCard items={items} maxItems={2} />);
    expect(screen.getByText('Läuft bald ab')).toBeInTheDocument();
    expect(screen.getByText('Milch')).toBeInTheDocument();
    expect(screen.getByText('Käse')).toBeInTheDocument();
    expect(screen.queryByText('Joghurt')).not.toBeInTheDocument();
  });
});
