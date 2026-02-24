import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryItemCard } from '@/app/components/inventory/InventoryItemCard';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { InventoryItem } from '@/app/stores/inventoryStore';

describe('InventoryItemCard', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const mockItem: InventoryItem = {
    id: '1',
    name: 'Vollmilch',
    category: 'Milchprodukte',
    brand: 'Bio',
    quantity: 2,
    unit: 'l',
    expiryDate: '2025-03-15',
    location: 'Kühlschrank',
    addedDate: '2025-01-01',
  };

  it('renders item name, quantity and location', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<InventoryItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Vollmilch')).toBeInTheDocument();
    expect(screen.getByText('Bio')).toBeInTheDocument();
    expect(screen.getByText('Menge:')).toBeInTheDocument();
    expect(screen.getByText(/2 l/)).toBeInTheDocument();
    expect(screen.getByText('Kühlschrank')).toBeInTheDocument();
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
  });

  it('renders expiry date and badge when expiryDate is set', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<InventoryItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText(/MHD:/)).toBeInTheDocument();
    expect(screen.getByText(/15\.03\.2025/)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<InventoryItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByTitle('Bearbeiten'));
    expect(onEdit).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<InventoryItemCard item={mockItem} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByTitle('Löschen'));
    expect(onDelete).toHaveBeenCalledWith('1', 'Vollmilch');
  });

  it('renders barcode when present', () => 
  {
    const itemWithBarcode = { ...mockItem, barcode: '4008400402123' };
    render(<InventoryItemCard item={itemWithBarcode} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/Barcode:/)).toBeInTheDocument();
    expect(screen.getByText(/4008400402123/)).toBeInTheDocument();
  });
});
