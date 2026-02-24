import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChefHat, Clock, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import {
  formatIngredient,
  getDifficultyColor,
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

  if (!recipe) return null;

  return (
    <Dialog open={!!recipe} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ChefHat className="w-6 h-6" />
            {recipe.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Info */}
          <div className="flex gap-4 flex-wrap">
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {t(`difficulties.${recipe.difficulty}`)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {recipe.cookingTime} {t('recipes.minuteShort')}
            </Badge>
            <Badge variant="outline">
              {t('recipes.servings', { count: recipe.servings })}
            </Badge>
            <Badge
              className={
                recipe.matchPercentage === 100
                  ? 'bg-green-600 text-white'
                  : recipe.matchPercentage > 0
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-600 text-white'
              }
            >
              {t('recipes.available', { percent: Math.round(recipe.matchPercentage) })}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => { onClose(); onEdit(recipe); }}
            >
              <Edit className="w-4 h-4" />
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => { onDelete(e); onClose(); }}
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </Button>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold mb-3">{t('recipes.ingredients')}</h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, index) => 
              {
                const isAvailable = ingredientMatches(ing, inventory);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded ${
                      isAvailable ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className={isAvailable ? 'text-green-900' : 'text-red-900'}>
                      {formatIngredient(ing)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold mb-3">{t('recipes.preparation')}</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                {t('recipes.missingIngredients', { count: recipe.missingIngredients.length })}
              </h4>
              <p className="text-sm text-yellow-800">
                {recipe.missingIngredients.map(formatIngredient).join(', ')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
