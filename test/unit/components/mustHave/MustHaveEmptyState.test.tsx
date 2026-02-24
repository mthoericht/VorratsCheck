import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MustHaveEmptyState } from '@/app/components/mustHave/MustHaveEmptyState';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('MustHaveEmptyState', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders empty state message and add button', () => 
  {
    const onAddClick = vi.fn();
    render(<MustHaveEmptyState onAddClick={onAddClick} />);
    expect(screen.getByText('Keine Must-Have Artikel definiert')).toBeInTheDocument();
    expect(screen.getByText('Ersten Artikel hinzufügen')).toBeInTheDocument();
  });

  it('calls onAddClick when button is clicked', () => 
  {
    const onAddClick = vi.fn();
    render(<MustHaveEmptyState onAddClick={onAddClick} />);
    fireEvent.click(screen.getByText('Ersten Artikel hinzufügen'));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });
});
