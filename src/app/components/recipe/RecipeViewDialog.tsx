import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Box, Stack, Typography } from '@mui/material';
import { ChefHat, Clock, Edit, Trash2, CheckCircle2, XCircle } from '@/app/lib/icons';
import {
  formatIngredient,
  ingredientMatches,
  type RecipeWithMatch,
} from '../../lib/recipe';
import type { InventoryItem } from '../../stores/inventoryStore';
import { useTranslation } from '../../lib/i18n';

interface RecipeViewDialogProps {
  recipe: RecipeWithMatch | null;
  inventory: InventoryItem[];
  onClose: () => void;
  onEdit: (recipe: RecipeWithMatch) => void;
  onDelete: (e: React.MouseEvent) => void;
}

/** Read-only recipe detail dialog with meta, ingredients (availability), instructions, missing ingredients. */
export function RecipeViewDialog({
  recipe,
  inventory,
  onClose,
  onEdit,
  onDelete,
}: RecipeViewDialogProps) 
{
  const { t } = useTranslation();
  const difficultyStyle = (() =>
  {
    switch (recipe?.difficulty)
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

  if (!recipe) return null;

  return (
    <Dialog open={!!recipe} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ChefHat className="w-6 h-6" />
            {recipe.name}
          </DialogTitle>
          <DialogDescription>{t('recipes.subtitle')}</DialogDescription>
        </DialogHeader>

        <Stack spacing={3}>
          {/* Meta Info */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Badge style={difficultyStyle}>
              {t(`difficulties.${recipe.difficulty}`)}
            </Badge>
            <Badge variant="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock className="w-3 h-3" />
              {recipe.cookingTime} {t('recipes.minuteShort')}
            </Badge>
            <Badge variant="outline">
              {t('recipes.servings', { count: recipe.servings })}
            </Badge>
            <Badge style={
              recipe.matchPercentage === 100
                ? { backgroundColor: '#16a34a', color: '#ffffff', borderColor: '#16a34a' }
                : recipe.matchPercentage > 0
                  ? { backgroundColor: '#ca8a04', color: '#ffffff', borderColor: '#ca8a04' }
                  : { backgroundColor: '#4b5563', color: '#ffffff', borderColor: '#4b5563' }
            }>
              {t('recipes.available', { percent: Math.round(recipe.matchPercentage) })}
            </Badge>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { onClose(); onEdit(recipe); }}
            >
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              sx={{ color: 'error.main' }}
              onClick={(e) => { onDelete(e); onClose(); }}
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </Button>
          </Box>

          {/* Ingredients */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>{t('recipes.ingredients')}</Typography>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, index) => 
              {
                const isAvailable = ingredientMatches(ing, inventory);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: isAvailable ? '#86efac' : '#fca5a5',
                      backgroundColor: isAvailable ? '#f0fdf4' : '#fef2f2',
                    }}
                  >
                    {isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <Typography sx={{ color: isAvailable ? '#14532d' : '#7f1d1d' }}>
                      {formatIngredient(ing)}
                    </Typography>
                  </Box>
                );
              })}
            </div>
          </Box>

          {/* Instructions */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>{t('recipes.preparation')}</Typography>
            <Box component="ol" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 0, m: 0 }}>
              {recipe.instructions.map((instruction, index) => (
                <Box key={index} component="li" sx={{ display: 'flex', gap: 1.5, listStyle: 'none' }}>
                  <Box
                    component="span"
                    sx={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography sx={{ pt: 0.25 }}>{instruction}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <Box sx={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 2, p: 2 }}>
              <Typography component="h4" sx={{ fontWeight: 600, color: '#78350f', mb: 1 }}>
                {t('recipes.missingIngredients', { count: recipe.missingIngredients.length })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#92400e' }}>
                {recipe.missingIngredients.map(formatIngredient).join(', ')}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
