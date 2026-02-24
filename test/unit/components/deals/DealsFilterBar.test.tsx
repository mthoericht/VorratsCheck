import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DealsFilterBar } from '@/app/components/deals/DealsFilterBar';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('DealsFilterBar', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders filter buttons with counts', () => 
  {
    const setFilterType = vi.fn();
    render(
      <DealsFilterBar
        filterType="all"
        setFilterType={setFilterType}
        mustHaveCount={2}
        wishListCount={1}
      />
    );
    expect(screen.getByText('Alle Angebote')).toBeInTheDocument();
    expect(screen.getByText('Must-Have')).toBeInTheDocument();
    expect(screen.getByText('Wunschliste')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls setFilterType when buttons are clicked', () => 
  {
    const setFilterType = vi.fn();
    render(
      <DealsFilterBar
        filterType="all"
        setFilterType={setFilterType}
        mustHaveCount={0}
        wishListCount={0}
      />
    );
    fireEvent.click(screen.getByText('Must-Have'));
    expect(setFilterType).toHaveBeenCalledWith('mustHave');
    fireEvent.click(screen.getByText('Wunschliste'));
    expect(setFilterType).toHaveBeenCalledWith('wishList');
    fireEvent.click(screen.getByText('Alle Angebote'));
    expect(setFilterType).toHaveBeenCalledWith('all');
  });
});
