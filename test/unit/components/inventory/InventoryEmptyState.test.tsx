import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryEmptyState } from '@/app/components/inventory/InventoryEmptyState';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('InventoryEmptyState', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders empty state message and add button', () => 
  {
    const onAddClick = vi.fn();
    render(<InventoryEmptyState onAddClick={onAddClick} />);
    expect(screen.getByText('Keine Artikel gefunden')).toBeInTheDocument();
    expect(screen.getByText('Ersten Artikel hinzufügen')).toBeInTheDocument();
  });

  it('calls onAddClick when button is clicked', () => 
  {
    const onAddClick = vi.fn();
    render(<InventoryEmptyState onAddClick={onAddClick} />);
    fireEvent.click(screen.getByText('Ersten Artikel hinzufügen'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });
});
