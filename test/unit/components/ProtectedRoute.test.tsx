import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useAuthStore } from '@/app/stores/authStore';

function renderWithRouter(initialEntries = ['/dashboard']) 
{
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => 
{
  beforeEach(() => 
  {
    useAuthStore.setState({ user: null, isLoading: false });
  });

  it('redirects to /login when user is null', () => 
  {
    renderWithRouter();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => 
  {
    useAuthStore.setState({ isLoading: true });
    renderWithRouter();
    expect(screen.getByText(/Lädt/)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is set', () => 
  {
    useAuthStore.setState({
      user: { id: '1', email: 'u@test.de', username: 'user' },
      isLoading: false,
    });
    renderWithRouter();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
