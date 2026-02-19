import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChefHat, Clock, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { formatIngredient } from '../../lib/recipeIngredients';
import { ingredientMatches, type RecipeWithMatch } from '../../lib/recipeMatching';
import type { InventoryItem } from '../../stores/inventoryStore';

interface RecipeViewDialogProps {
  recipe: RecipeWithMatch | null;
  inventory: InventoryItem[];
  onClose: () => void;
  onEdit: (recipe: RecipeWithMatch) => void;
  onDelete: (e: React.MouseEvent) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

/** Read-only recipe detail dialog with meta, ingredients (availability), instructions, missing ingredients. */
export function RecipeViewDialog({
  recipe,
  inventory,
  onClose,
  onEdit,
  onDelete,
  getDifficultyColor,
  getDifficultyLabel,
}: RecipeViewDialogProps) 
{
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
              {getDifficultyLabel(recipe.difficulty)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {recipe.cookingTime} Min
            </Badge>
            <Badge variant="outline">
              {recipe.servings} Portionen
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
              {Math.round(recipe.matchPercentage)}% Verfügbar
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
              Bearbeiten
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => { onDelete(e); onClose(); }}
            >
              <Trash2 className="w-4 h-4" />
              Löschen
            </Button>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold mb-3">Zutaten</h3>
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
            <h3 className="font-semibold mb-3">Zubereitung</h3>
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
                Fehlende Zutaten ({recipe.missingIngredients.length})
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
