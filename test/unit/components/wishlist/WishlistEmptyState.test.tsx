import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishlistEmptyState } from '@/app/components/wishlist/WishlistEmptyState';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('WishlistEmptyState', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders empty state message and add button', () => 
  {
    const onAddClick = vi.fn();
    render(<WishlistEmptyState onAddClick={onAddClick} />);
    expect(screen.getByText('Keine Artikel auf der Wunschliste')).toBeInTheDocument();
    expect(screen.getByText('Ersten Artikel hinzufügen')).toBeInTheDocument();
  });

  it('calls onAddClick when button is clicked', async () => 
  {
    const onAddClick = vi.fn();
    render(<WishlistEmptyState onAddClick={onAddClick} />);
    fireEvent.click(screen.getByText('Ersten Artikel hinzufügen'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });
});
