import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { LowStockCard } from '@/app/components/dashboard/LowStockCard';

function renderWithRouter(ui: React.ReactElement) 
{
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('LowStockCard', () => 
{
  it('renders nothing when items is empty', () => 
  {
    const { container } = renderWithRouter(<LowStockCard items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders card with low-stock items', () => 
  {
    const items = [
      { id: '1', name: 'Milch', minQuantity: 2 },
      { id: '2', name: 'Butter', minQuantity: 1 },
    ];
    renderWithRouter(<LowStockCard items={items} />);
    expect(screen.getByText('Niedriger Bestand')).toBeInTheDocument();
    expect(screen.getByText('Milch')).toBeInTheDocument();
    expect(screen.getByText('Butter')).toBeInTheDocument();
    expect(screen.getByText(/Zur Must-Have Liste/)).toBeInTheDocument();
  });
});
