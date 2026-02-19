import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/app/components/ui/input';

describe('Input', () => 
{
  it('renders with placeholder', () => 
  {
    render(<Input placeholder="E-Mail" />);
    expect(screen.getByPlaceholderText('E-Mail')).toBeInTheDocument();
  });

  it('can be disabled', () => 
  {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId('input')).toBeDisabled();
  });

  it('displays controlled value', () => 
  {
    render(<Input value="test@example.com" readOnly data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveValue('test@example.com');
  });
});
