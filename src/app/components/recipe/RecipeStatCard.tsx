import React from 'react';
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
    <Card className={borderClassName}>
      <CardHeader className="pb-2">
        <CardTitle className={titleClassName}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={valueClassName}>{value}</div>
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
