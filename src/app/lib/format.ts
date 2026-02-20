/**
 * Format a date for display in German locale (Tag.Monat.Jahr, e.g. 20.02.2025).
 * Use for all user-facing date output in the frontend.
 */
export function formatDateDE(date: string | Date): string
{
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
