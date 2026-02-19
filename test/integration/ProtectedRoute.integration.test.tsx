import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from '../../src/app/components/ProtectedRoute';
import { useAuthStore } from '../../src/app/stores/authStore';

describe('ProtectedRoute (integration)', () => 
{
  beforeEach(() => 
  {
    useAuthStore.setState({ user: null, isLoading: false });
  });

  it('when not logged in, navigating to / shows Login page', () => 
  {
    useAuthStore.setState({ user: null });
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('when logged in, navigating to / shows protected content', () => 
  {
    useAuthStore.setState({
      user: { id: '1', email: 'u@test.de', username: 'user' },
    });
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});
