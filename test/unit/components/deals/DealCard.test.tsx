import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DealCard } from '@/app/components/deals/DealCard';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { Deal } from '@/app/stores/dealsStore';

describe('DealCard', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const mockDeal: Deal = {
    id: '1',
    product: 'Vollmilch',
    name: 'Milchprodukte',
    store: 'Rewe',
    originalPrice: 1.49,
    discountPrice: 0.99,
    discount: 34,
    validUntil: '2025-03-31',
    distance: 2,
    inStock: true,
  };

  it('renders deal product, prices and validity', () => 
  {
    render(
      <DealCard deal={mockDeal} isMustHave={false} isWishList={false} />
    );
    expect(screen.getByText('Vollmilch')).toBeInTheDocument();
    expect(screen.getByText('Milchprodukte')).toBeInTheDocument();
    expect(screen.getByText('-34%')).toBeInTheDocument();
    expect(screen.getByText('€1.49')).toBeInTheDocument();
    expect(screen.getByText('€0.99')).toBeInTheDocument();
    expect(screen.getByText('Ersparnis')).toBeInTheDocument();
    expect(screen.getByText('Gültig bis:')).toBeInTheDocument();
    expect(screen.getByText(/31\.03\.2025/)).toBeInTheDocument();
    expect(screen.getByText('Zum Angebot')).toBeInTheDocument();
  });

  it('renders Must-Have and Wishlist badges when set', () => 
  {
    render(
      <DealCard deal={mockDeal} isMustHave={true} isWishList={true} />
    );
    expect(screen.getByText('Must-Have')).toBeInTheDocument();
    expect(screen.getByText('Wunschliste')).toBeInTheDocument();
  });

  it('renders out of stock warning when inStock is false', () => 
  {
    render(
      <DealCard deal={{ ...mockDeal, inStock: false }} isMustHave={false} isWishList={false} />
    );
    expect(screen.getByText(/Möglicherweise nicht auf Lager/)).toBeInTheDocument();
  });
});
