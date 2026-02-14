import React from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) 
{
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) 
  {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!user) 
  {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
