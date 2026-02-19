/**
 * Recipe–inventory matching: check if an ingredient is covered by inventory (by name and quantity/unit).
 */

import type { Recipe } from '../stores/recipesStore';
import type { RecipeIngredient } from './recipeIngredients';
import type { InventoryItem } from '../stores/inventoryStore';
import { quantityCovers } from './units';

export interface RecipeWithMatch extends Recipe {
  availableIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  matchPercentage: number;
  totalIngredientsCount: number;
}

/** Returns whether the given ingredient is covered by at least one inventory item. */
export function ingredientMatches(ing: RecipeIngredient, inventory: InventoryItem[]): boolean 
{
  const nameLower = ing.name.toLowerCase().trim();
  if (!nameLower) return false;
  const candidates = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(nameLower) ||
      nameLower.includes(item.name.toLowerCase()) ||
      item.category.toLowerCase().includes(nameLower) ||
      nameLower.includes(item.category.toLowerCase())
  );
  if (candidates.length === 0) return false;
  if (ing.quantity != null && ing.unit && Number.isFinite(Number(ing.quantity))) 
  {
    const needQty = Number(ing.quantity);
    const needUnit = ing.unit;
    return candidates.some((item) =>
      quantityCovers(item.quantity, item.unit || 'Stück', needQty, needUnit)
    );
  }
  return true;
}

/** Computes match data for each recipe (available/missing ingredients, percentage). */
export function computeRecipesWithMatch(
  recipes: Recipe[],
  inventory: InventoryItem[]
): RecipeWithMatch[] 
{
  return recipes.map((recipe) => 
  {
    const relevant = recipe.ingredients.filter((ing) => ing.name.trim());
    const availableIngredients = relevant.filter((ing) => ingredientMatches(ing, inventory));
    const missingIngredients = relevant.filter((ing) => !ingredientMatches(ing, inventory));
    const totalIngredientsCount = relevant.length;
    const matchPercentage = totalIngredientsCount > 0 
      ? (availableIngredients.length / totalIngredientsCount) * 100 
      : 0;
    return {
      ...recipe,
      availableIngredients,
      missingIngredients,
      matchPercentage,
      totalIngredientsCount,
    };
  });
}
