import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChefHat, Edit, Trash2 } from 'lucide-react';
import { formatIngredient } from '../../lib/recipeIngredients';
import type { RecipeWithMatch } from '../../lib/recipeMatching';

interface RecipeCardProps {
  recipe: RecipeWithMatch;
  onClick: () => void;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

export function RecipeCard({
  recipe,
  onClick,
  onEdit,
  onDelete,
  getDifficultyColor,
  getDifficultyLabel,
}: RecipeCardProps) 
{
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              {recipe.name}
            </CardTitle>
            <CardDescription>
              {recipe.servings} Portionen · {recipe.cookingTime} Minuten
            </CardDescription>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => 
              {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {getDifficultyLabel(recipe.difficulty)}
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
            {Math.round(recipe.matchPercentage)}% verfügbar
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Zutaten:</span>
            <span className="font-medium">
              {recipe.availableIngredients?.length || 0} / {recipe.totalIngredientsCount ?? recipe.ingredients.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                recipe.matchPercentage === 100 
                  ? 'bg-green-600' 
                  : recipe.matchPercentage > 0 
                    ? 'bg-yellow-600' 
                    : 'bg-gray-400'
              }`}
              style={{ width: `${recipe.matchPercentage}%` }}
            />
          </div>
        </div>
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <div className="text-sm text-gray-600">
            Fehlt: {recipe.missingIngredients.slice(0, 2).map(formatIngredient).join(', ')}
            {recipe.missingIngredients.length > 2 && ` +${recipe.missingIngredients.length - 2}`}
          </div>
        )}
        <Button className="w-full gap-2" variant="outline">
          <ChefHat className="w-4 h-4" />
          Rezept anzeigen
        </Button>
      </CardContent>
    </Card>
  );
}
