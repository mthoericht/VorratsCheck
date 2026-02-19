import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Login } from '../../src/app/pages/Login';
import { useAuthStore } from '../../src/app/stores/authStore';
import * as api from '../../src/app/lib/api';

vi.mock('@/app/lib/api', () => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

describe('Login (integration)', () => 
{
  beforeEach(() => 
  {
    useAuthStore.setState({ user: null });
    vi.mocked(api.login).mockReset();
  });

  it('renders login form with title and fields', () => 
  {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('VorratsCheck')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
  });

  it('shows error when login fails', async () => 
  {
    vi.mocked(api.login).mockRejectedValue(new Error('Ungültige Anmeldedaten'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /anmelden/i }));

    await waitFor(() => 
    {
      expect(screen.getByText(/Ungültige Anmeldedaten|Login fehlgeschlagen/)).toBeInTheDocument();
    });
  });
});
