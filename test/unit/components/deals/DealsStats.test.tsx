import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DealsStats } from '@/app/components/deals/DealsStats';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('DealsStats', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders all stat titles and values', () => 
  {
    render(
      <DealsStats
        totalCount={20}
        mustHaveCount={5}
        wishListCount={3}
        avgDiscount={25}
      />
    );
    expect(screen.getByText('Alle Angebote')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Must-Have Angebote')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Wunschliste Angebote')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Durchschnitt Ersparnis')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('renders 0% when totalCount is zero', () => 
  {
    render(
      <DealsStats
        totalCount={0}
        mustHaveCount={0}
        wishListCount={0}
        avgDiscount={0}
      />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
