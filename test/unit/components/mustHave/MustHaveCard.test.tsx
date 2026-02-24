import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MustHaveCard } from '@/app/components/mustHave/MustHaveCard';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { MustHaveItem } from '@/app/stores/mustHaveStore';

describe('MustHaveCard', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const mockItem: MustHaveItem = {
    id: '1',
    name: 'Milch',
    category: 'Milchprodukte',
    minQuantity: 2,
    unit: 'l',
  };

  const sufficientStatus = {
    current: 2,
    needed: 2,
    displayCurrent: 2,
    displayNeeded: 2,
    displayUnit: 'l',
    isLow: false,
  };

  const lowStatus = {
    current: 0.5,
    needed: 2,
    displayCurrent: 0.5,
    displayNeeded: 2,
    displayUnit: 'l',
    isLow: true,
  };

  it('renders item name and sufficient stock message', () => 
  {
    render(
      <MustHaveCard
        item={mockItem}
        status={sufficientStatus}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Milch')).toBeInTheDocument();
    expect(screen.getByText(/Ausreichend vorhanden/)).toBeInTheDocument();
    expect(screen.getByText('Aktueller Bestand:')).toBeInTheDocument();
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
  });

  it('renders low stock message and still needed when isLow', () => 
  {
    render(
      <MustHaveCard
        item={mockItem}
        status={lowStatus}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Milch')).toBeInTheDocument();
    expect(screen.getByText(/Nachkaufen erforderlich/)).toBeInTheDocument();
    expect(screen.getByText(/Noch .* benötigt/)).toBeInTheDocument();
  });

  it('calls onEdit and onDelete when buttons are clicked', () => 
  {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <MustHaveCard
        item={mockItem}
        status={sufficientStatus}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByTitle('Bearbeiten'));
    expect(onEdit).toHaveBeenCalledWith(mockItem);
    fireEvent.click(screen.getByTitle('Löschen'));
    expect(onDelete).toHaveBeenCalledWith('1', 'Milch');
  });
});
