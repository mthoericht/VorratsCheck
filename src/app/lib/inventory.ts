import { INVENTORY_LOCATIONS } from '@shared/constants';

/** Options for inventory item location (storage place). Used in form and filter. */
export const INVENTORY_LOCATION_OPTIONS = INVENTORY_LOCATIONS as readonly { value: string; label: string }[];

/**
 * Returns expiry status for display (badge label and variant).
 * Used by Inventory item cards and dashboard.
 */
export function getExpiryStatus(expiryDate?: string): { status: 'expired' | 'warning' | 'ok'; label: string; variant: 'destructive' | 'outline' | 'secondary' } | null
{
  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0)
  {
    return { status: 'expired', label: 'Abgelaufen', variant: 'destructive' };
  }
  if (daysUntilExpiry <= 7)
  {
    return { status: 'warning', label: `${daysUntilExpiry} Tage`, variant: 'outline' };
  }
  return { status: 'ok', label: `${daysUntilExpiry} Tage`, variant: 'secondary' };
}
