import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Dashboard } from '../../src/app/pages/Dashboard';
import { useInventoryStore } from '../../src/app/stores/inventoryStore';
import { useMustHaveStore } from '../../src/app/stores/mustHaveStore';
import { useWishlistStore } from '../../src/app/stores/wishlistStore';

describe('Dashboard (integration)', () => 
{
  beforeEach(() => 
  {
    useInventoryStore.setState({ items: [] });
    useMustHaveStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it('renders dashboard title and stat cards', () => 
  {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Übersicht über Ihren Vorrat/)).toBeInTheDocument();
    expect(screen.getByText('Gesamt Artikel')).toBeInTheDocument();
    expect(screen.getByText('Läuft bald ab')).toBeInTheDocument();
    expect(screen.getByText('Niedrige Bestände')).toBeInTheDocument();
    expect(screen.getByText('Wunschliste')).toBeInTheDocument();
  });

  it('displays inventory count when store has items', () => 
  {
    useInventoryStore.setState({
      items: [
        {
          id: '1',
          name: 'Milch',
          category: 'Milch',
          quantity: 1,
          unit: 'l',
          addedDate: '2025-01-01',
        },
      ],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // at least one stat shows 1
  });

  it('shows Schnellzugriff section', () => 
  {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Schnellzugriff')).toBeInTheDocument();
  });
});
