import React from 'react';
import { RecipeCard } from './RecipeCard';
import type { RecipeWithMatch } from '../../lib/recipe';

interface RecipeListSectionProps {
  title: string;
  icon: React.ReactNode;
  recipes: RecipeWithMatch[];
  onSelectRecipe: (recipe: RecipeWithMatch) => void;
  onEdit: (recipe: RecipeWithMatch) => void;
  onDelete: (id: string, name: string, e: React.MouseEvent) => void;
}

/** Eine Sektion mit Überschrift und Grid aus RecipeCards (z. B. Sofort kochbar, Teilweise möglich). */
export function RecipeListSection({
  title,
  icon,
  recipes,
  onSelectRecipe,
  onEdit,
  onDelete,
}: RecipeListSectionProps) 
{
  if (recipes.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title} ({recipes.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelectRecipe(recipe)}
            onEdit={() => onEdit(recipe)}
            onDelete={(e) => onDelete(recipe.id, recipe.name, e)}
          />
        ))}
      </div>
    </div>
  );
}
