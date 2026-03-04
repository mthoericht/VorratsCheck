import { AlertCircle } from '@/app/lib/icons';
import { Alert, AlertDescription } from './alert';

interface StoreErrorAlertProps
{
  error: string | null | undefined;
}

export function StoreErrorAlert({ error }: StoreErrorAlertProps)
{
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
