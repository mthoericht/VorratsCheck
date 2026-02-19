import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/app/components/ui/button';

describe('Button', () => 
{
  it('renders children', () => 
  {
    render(<Button>Klick mich</Button>);
    expect(screen.getByRole('button', { name: /klick mich/i })).toBeInTheDocument();
  });

  it('applies variant class when variant is destructive', () => 
  {
    render(<Button variant="destructive">Löschen</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-destructive');
  });

  it('can be disabled', () => 
  {
    render(<Button disabled>Deaktiviert</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
