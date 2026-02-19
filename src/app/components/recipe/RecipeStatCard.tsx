import { cn } from '../ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface RecipeStatCardProps {
  title: string;
  value: number;
  subtitle: string;
  borderClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
}

/** Einzelne Statistik-Karte (z. B. Sofort kochbar, Gesamt Rezepte). */
export function RecipeStatCard({
  title,
  value,
  subtitle,
  borderClassName = 'border-gray-200',
  titleClassName = 'text-sm font-medium text-gray-800',
  valueClassName = 'text-2xl font-bold text-gray-600',
}: RecipeStatCardProps) 
{
  return (
    <Card className={cn('gap-2', borderClassName)}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className={titleClassName}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className={valueClassName}>{value}</div>
        <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
