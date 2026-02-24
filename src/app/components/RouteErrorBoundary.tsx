import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from './ui/button';
import { isApiError } from '../lib/api';
import { useTranslation } from '../lib/i18n';

/** Error UI for route-level errors (React Router errorElement). */
export function RouteErrorBoundary() 
{
  const error = useRouteError();
  const { t } = useTranslation();

  const message = isRouteErrorResponse(error)
    ? (typeof error.data === 'string' ? error.data : (error.data as { message?: string })?.message) ?? error.statusText ?? t('errors.generic')
    : error instanceof Error
      ? error.message
      : t('errors.unexpected');

  const isAuthError = isApiError(error) && error.isUnauthorized;

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
          {t('errors.somethingWrong')}
        </h2>
        <p className="text-gray-600 dark:text-muted-foreground">{message}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {isAuthError ? (
            <Button asChild>
              <Link to="/login">{t('errors.goToLogin')}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t('errors.reloadPage')}
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/" className="gap-2">
              <Home className="w-4 h-4" />
              {t('errors.goToHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
