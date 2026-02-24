/** Storage locations for inventory items. Client-only (form and filter); server accepts any string. */
export const INVENTORY_LOCATIONS = [
  { value: 'Kühlschrank', id: 'fridge' },
  { value: 'Gefrierschrank', id: 'freezer' },
  { value: 'Vorratsschrank', id: 'pantry' },
] as const;

export type InventoryLocation = (typeof INVENTORY_LOCATIONS)[number]['value'];

/** Options for inventory item location (storage place). Used in form and filter. */
export const INVENTORY_LOCATION_OPTIONS = INVENTORY_LOCATIONS as readonly { value: string; id: string }[];

/**
 * Returns expiry status for display (status, days until expiry, and badge variant).
 * The calling component translates the label via i18n keys.
 */
export function getExpiryStatus(expiryDate?: string): { status: 'expired' | 'warning' | 'ok'; daysUntilExpiry: number; variant: 'destructive' | 'outline' | 'secondary' } | null
{
  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0)
  {
    return { status: 'expired', daysUntilExpiry, variant: 'destructive' };
  }
  if (daysUntilExpiry <= 7)
  {
    return { status: 'warning', daysUntilExpiry, variant: 'outline' };
  }
  return { status: 'ok', daysUntilExpiry, variant: 'secondary' };
}
