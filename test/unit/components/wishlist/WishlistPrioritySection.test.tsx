import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishlistPrioritySection } from '@/app/components/wishlist/WishlistPrioritySection';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { WishListItem } from '@/app/stores/wishlistStore';

describe('WishlistPrioritySection', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const highItems: WishListItem[] = [
    { id: '1', name: 'Item A', type: 'specific', priority: 'high' },
    { id: '2', name: 'Item B', type: 'specific', priority: 'high' },
  ];

  it('renders nothing when items is empty', () => 
  {
    const { container } = render(
      <WishlistPrioritySection
        priority="high"
        items={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders section title with priority label and count', () => 
  {
    render(
      <WishlistPrioritySection
        priority="high"
        items={highItems}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Hoch')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('renders item cards and calls onEdit/onDelete', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <WishlistPrioritySection
        priority="high"
        items={highItems}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getAllByTitle('Bearbeiten')[0]);
    expect(onEdit).toHaveBeenCalledWith(highItems[0]);
    fireEvent.click(screen.getAllByTitle('Löschen')[0]);
    expect(onDelete).toHaveBeenCalledWith('1', 'Item A');
  });
});
