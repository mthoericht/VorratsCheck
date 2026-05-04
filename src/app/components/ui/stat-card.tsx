import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from './utils';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAppPalette, type AppTone } from '@/app/lib/muiTheme';

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
  const theme = useTheme();
  const app = getAppPalette(theme);
  const tone: AppTone = titleClassName.includes('green') || valueClassName.includes('green')
    ? 'success'
    : titleClassName.includes('yellow') || valueClassName.includes('yellow') || titleClassName.includes('orange') || valueClassName.includes('orange')
      ? 'warning'
      : titleClassName.includes('pink') || valueClassName.includes('pink')
        ? 'accent'
        : titleClassName.includes('blue') || valueClassName.includes('blue')
          ? 'info'
          : 'neutral';
  const palette = app[tone];

  return (
    <Card
      className={cn('gap-2', className)}
      sx={{ borderColor: palette.border, backgroundColor: palette.bg }}
    >
      <CardHeader className={cn('px-4 pt-4 pb-0 md:px-6 md:pt-6', icon && 'flex flex-row items-center justify-between')}>
        <CardTitle>
          <Typography variant="body2" sx={{ fontWeight: 600, color: palette.text }}>
            {title}
          </Typography>
        </CardTitle>
        {icon && <Box component="span" sx={{ flexShrink: 0 }}>{icon}</Box>}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 md:px-6 md:pb-6">
        <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: palette.value, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {subtitle != null && subtitle !== '' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
