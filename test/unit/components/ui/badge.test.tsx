import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/app/components/ui/badge';

describe('Badge', () => 
{
  it('renders children', () => 
  {
    render(<Badge>Abgelaufen</Badge>);
    expect(screen.getByText('Abgelaufen')).toBeInTheDocument();
  });

  it('applies destructive variant', () => 
  {
    render(<Badge variant="destructive">Fehler</Badge>);
    const badge = screen.getByText('Fehler');
    expect(badge).toHaveClass('bg-destructive');
  });
});
