import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from './utils';

export interface StatCardProps {
  /** Card title (headline) */
  title: string;
  /** Main value (number or string, e.g. "12%") */
  value: React.ReactNode;
  /** Optional short text below the value */
  subtitle?: string;
  /** Optional icon (e.g. Lucide icon) – shown in header when provided */
  icon?: React.ReactNode;
  /** Card border/background (e.g. "border-green-200") */
  className?: string;
  /** Title text style (e.g. "text-sm font-medium text-green-800") */
  titleClassName?: string;
  /** Value text style (e.g. "text-2xl font-bold text-green-600") */
  valueClassName?: string;
}

/**
 * Unified stat card: headline, optional icon, value, optional subtitle.
 * Used on Dashboard, MustHave, WishList, Deals, Recipes.
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  className = '',
  titleClassName = 'text-sm font-medium',
  valueClassName = 'text-2xl font-bold',
}: StatCardProps) 
{
  return (
    <Card className={cn('gap-2', className)}>
      <CardHeader className={cn('px-4 pt-4 pb-0 md:px-6 md:pt-6', icon && 'flex flex-row items-center justify-between')}>
        <CardTitle className={titleClassName}>{title}</CardTitle>
        {icon && <span className="shrink-0">{icon}</span>}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 md:px-6 md:pb-6">
        <div className={valueClassName}>{value}</div>
        {subtitle != null && subtitle !== '' && (
          <p className="text-xs text-gray-600 dark:text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
