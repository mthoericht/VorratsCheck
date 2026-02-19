import { useState, useMemo } from 'react';
import type { Recipe } from '../stores/recipesStore';
import type { InventoryItem } from '../stores/inventoryStore';
import { computeRecipesWithMatch, type RecipeWithMatch } from '../lib/recipeMatching';

/** Provides recipes with inventory match data and sorting (by match % or cooking time). */
export function useRecipesWithMatch(
  recipes: Recipe[],
  inventory: InventoryItem[]
): {
  recipesWithMatch: RecipeWithMatch[];
  sortedRecipes: RecipeWithMatch[];
  sortBy: 'match' | 'time';
  setSortBy: (value: 'match' | 'time') => void;
} 
{
  const [sortBy, setSortBy] = useState<'match' | 'time'>('match');

  const recipesWithMatch = useMemo(
    () => computeRecipesWithMatch(recipes, inventory),
    [recipes, inventory]
  );

  const sortedRecipes = useMemo(() => 
  {
    const sorted = [...recipesWithMatch];
    if (sortBy === 'match') 
    {
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
    else 
    {
      sorted.sort((a, b) => a.cookingTime - b.cookingTime);
    }
    return sorted;
  }, [recipesWithMatch, sortBy]);

  return { recipesWithMatch, sortedRecipes, sortBy, setSortBy };
}
