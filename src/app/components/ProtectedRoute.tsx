import React from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../lib/i18n';

export function ProtectedRoute({ children }: { children: React.ReactNode }) 
{
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const { t } = useTranslation();

  if (isLoading) 
  {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"
            aria-hidden={true}
          />
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
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
