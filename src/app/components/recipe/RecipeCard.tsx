import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChefHat, Edit, Trash2 } from '@/app/lib/icons';
import { Box, LinearProgress, Typography } from '@mui/material';
import {
  formatIngredient,
  type RecipeWithMatch,
} from '../../lib/recipe';
import { useTranslation } from '../../lib/i18n';

interface RecipeCardProps {
  recipe: RecipeWithMatch;
  onClick: () => void;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function RecipeCard({
  recipe,
  onClick,
  onEdit,
  onDelete,
}: RecipeCardProps) 
{
  const { t } = useTranslation();
  const difficultyStyle = (() =>
  {
    switch (recipe.difficulty)
    {
      case 'easy':
        return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#86efac' };
      case 'medium':
        return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' };
      case 'hard':
        return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  })();
  const availabilityStyle = recipe.matchPercentage === 100
    ? { backgroundColor: '#16a34a', color: '#ffffff', borderColor: '#16a34a' }
    : recipe.matchPercentage > 0
      ? { backgroundColor: '#ca8a04', color: '#ffffff', borderColor: '#ca8a04' }
      : { backgroundColor: '#4b5563', color: '#ffffff', borderColor: '#4b5563' };
  const progressColor = recipe.matchPercentage === 100 ? '#16a34a' : recipe.matchPercentage > 0 ? '#ca8a04' : '#9ca3af';

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow group"
      style={{ height: '100%' }}
      sx={{ border: '1px solid', borderColor: 'divider' }}
      onClick={onClick}
    >
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChefHat className="w-5 h-5" style={{ color: '#059669' }} />
                {recipe.name}
              </Box>
            </CardTitle>
            <CardDescription>
              {t('recipes.servingsMinutes', { servings: recipe.servings, time: recipe.cookingTime })}
            </CardDescription>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => 
              {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0"
              aria-label={t('common.edit')}
              title={t('common.edit')}
            >
              <Edit className="w-4 h-4" aria-hidden={true} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label={t('common.delete')}
              title={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" aria-hidden={true} />
            </Button>
          </Box>
        </Box>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Badge style={difficultyStyle}>
              {t(`difficulties.${recipe.difficulty}`)}
            </Badge>
            <Badge style={availabilityStyle}>
              {t('recipes.availableLower', { percent: Math.round(recipe.matchPercentage) })}
            </Badge>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">{t('recipes.ingredientsCount')}</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {recipe.availableIngredients?.length || 0} / {recipe.totalIngredientsCount ?? recipe.ingredients.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, recipe.matchPercentage))}
              aria-label={t('recipes.availableLower', { percent: Math.round(recipe.matchPercentage) })}
              sx={{
                height: 8,
                borderRadius: 999,
                backgroundColor: '#e5e7eb',
                '& .MuiLinearProgress-bar': { backgroundColor: progressColor },
              }}
            />
          </Box>
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('recipes.missing')}{recipe.missingIngredients.slice(0, 2).map(formatIngredient).join(', ')}
              {recipe.missingIngredients.length > 2 && ` +${recipe.missingIngredients.length - 2}`}
            </Typography>
          )}
          <Button variant="outline" sx={{ mt: 'auto', width: '100%', gap: 1 }}>
            <ChefHat className="w-4 h-4" />
            {t('recipes.viewRecipe')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
