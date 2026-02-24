import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MustHaveStats } from '@/app/components/mustHave/MustHaveStats';
import { useSettingsStore } from '@/app/stores/settingsStore';

describe('MustHaveStats', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  it('renders total, sufficient and restock counts', () => 
  {
    render(
      <MustHaveStats
        totalCount={10}
        sufficientCount={7}
        lowCount={3}
      />
    );
    expect(screen.getByText('Gesamt Artikel')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Ausreichend vorrätig')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Nachkaufen')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders zeros when all counts are zero', () => 
  {
    render(
      <MustHaveStats
        totalCount={0}
        sufficientCount={0}
        lowCount={0}
      />
    );
    expect(screen.getByText('Gesamt Artikel')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});
