import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishlistItemCard } from '@/app/components/wishlist/WishlistItemCard';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { WishListItem } from '@/app/stores/wishlistStore';

describe('WishlistItemCard', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const mockItem: WishListItem = {
    id: '1',
    name: 'Schokolade',
    type: 'specific',
    category: 'Süßwaren',
    brand: 'Lindt',
    priority: 'high',
  };

  it('renders item name and optional category/brand', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<WishlistItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Schokolade')).toBeInTheDocument();
    expect(screen.getByText(/Süßwaren · Lindt/)).toBeInTheDocument();
    expect(screen.getByText('Kategorie:')).toBeInTheDocument();
    expect(screen.getByText('Marke:')).toBeInTheDocument();
  });

  it('renders without category/brand when not set', () => 
  {
    const item: WishListItem = { ...mockItem, category: undefined, brand: undefined };
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<WishlistItemCard item={item} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Schokolade')).toBeInTheDocument();
    expect(screen.queryByText('Kategorie:')).not.toBeInTheDocument();
    expect(screen.queryByText('Marke:')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<WishlistItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Bearbeiten'));
    expect(onEdit).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<WishlistItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Löschen'));
    expect(onDelete).toHaveBeenCalledWith('1', 'Schokolade');
  });
});
