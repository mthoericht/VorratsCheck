import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DealsEmptyState } from '@/app/components/deals/DealsEmptyState';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('DealsEmptyState', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders empty state message and hint', () => 
  {
    render(<DealsEmptyState />);
    expect(screen.getByText('Keine passenden Angebote gefunden')).toBeInTheDocument();
    expect(screen.getByText(/Versuchen Sie, Artikel zu Ihrer Must-Have oder Wunschliste hinzuzufügen/)).toBeInTheDocument();
  });
});
