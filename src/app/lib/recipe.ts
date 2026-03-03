/**
 * Recipe helpers: ingredients, formatting, difficulty labels, inventory matching.
 */

import type { Recipe } from '../stores/recipesStore';
import type { InventoryItem } from '../stores/inventoryStore';
import { quantityCovers, isPresenceOnlyUnit } from './units';

// --- Ingredients ---

export interface RecipeIngredient {
  name: string;
  quantity?: number;
  unit?: string;
}

/** Formats ingredient for display (e.g. "400 g Spaghetti" or "Salz"). */
export function formatIngredient(ing: RecipeIngredient): string 
{
  if (!ing.name) return '';
  if (ing.quantity != null && ing.unit) 
  {
    const q = Number(ing.quantity);
    if (Number.isFinite(q)) return `${ing.quantity} ${ing.unit} ${ing.name}`;
  }
  return ing.name;
}

// --- Difficulty (UI labels and badge classes) ---

/** Tailwind class for difficulty badge (e.g. bg-green-100 text-green-800). */
export function getDifficultyColor(difficulty: string): string 
{
  switch (difficulty) 
  {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/** German label for difficulty. */
export function getDifficultyLabel(difficulty: string): string 
{
  switch (difficulty) 
  {
    case 'easy': return 'Einfach';
    case 'medium': return 'Mittel';
    case 'hard': return 'Schwer';
    default: return difficulty;
  }
}

// --- Recipe–inventory matching ---

/** Checks if `term` appears in `text` at a word boundary (start of word, example: "Ei" → "Eier"). */
function wordStartMatch(text: string, term: string): boolean
{
  const idx = text.indexOf(term);
  if (idx === -1) return false;
  return idx === 0 || text[idx - 1] === ' ';
}

export interface RecipeWithMatch extends Recipe {
  availableIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  matchPercentage: number;
  totalIngredientsCount: number;
}

/**
 * Filters recipes by search query: keeps recipes whose name or any ingredient name
 * contains the query (case-insensitive substring). Empty or whitespace query returns all recipes.
 */
export function filterRecipesBySearch<T extends { name: string; ingredients: RecipeIngredient[] }>(
  recipes: T[],
  searchQuery: string
): T[]
{
  const q = searchQuery.trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter((r) =>
  {
    if (r.name.toLowerCase().includes(q)) return true;
    return r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
  });
}

/** Returns whether the given ingredient is covered by at least one inventory item. */
export function ingredientMatches(ing: RecipeIngredient, inventory: InventoryItem[]): boolean 
{
  const nameLower = ing.name.toLowerCase().trim();
  if (!nameLower) return false;

  const candidates = inventory.filter(
    (item) =>
      wordStartMatch(item.name.toLowerCase(), nameLower) ||
      wordStartMatch(nameLower, item.name.toLowerCase())      
  );

  if (candidates.length === 0) return false;
  
  if (ing.quantity != null && ing.unit && Number.isFinite(Number(ing.quantity))) 
  {
    // For presence-only units (e.g. Kugeln, Zehen) just require the ingredient to be in inventory.
    if (isPresenceOnlyUnit(ing.unit)) return true;
    const needQty = Number(ing.quantity);
    const needUnit = ing.unit;
    return candidates.some((item) =>
      quantityCovers(item.quantity, item.unit || 'stk', needQty, needUnit)
    );
  }
  return true;
}

/** Pre-normalizes inventory names/categories to lowercase for faster matching. */
interface NormalizedInventoryItem extends InventoryItem {
  nameLower: string;
  categoryLower: string;
}

function normalizeInventory(inventory: InventoryItem[]): NormalizedInventoryItem[] 
{
  return inventory.map((item) => ({
    ...item,
    nameLower: item.name.toLowerCase(),
    categoryLower: item.category.toLowerCase(),
  }));
}

/** Checks if an ingredient name fuzzy-matches an inventory item's name or category. */
function nameMatchesItem(ingredientName: string, item: NormalizedInventoryItem): boolean
{
  return wordStartMatch(item.nameLower, ingredientName) ||
    wordStartMatch(ingredientName, item.nameLower) ||
    wordStartMatch(item.categoryLower, ingredientName) ||
    wordStartMatch(ingredientName, item.categoryLower);
}

/** Checks if a recipe ingredient requires a specific quantity (not just presence). */
function hasQuantityRequirement(ing: RecipeIngredient): boolean
{
  return ing.quantity != null && ing.unit != null && Number.isFinite(Number(ing.quantity));
}

/** Checks if any candidate inventory item has enough quantity to cover the ingredient. */
function candidatesCoverQuantity(candidates: NormalizedInventoryItem[], needQty: number, needUnit: string): boolean
{
  return candidates.some((item) =>
    quantityCovers(item.quantity, item.unit || 'stk', needQty, needUnit)
  );
}

/** Returns whether the given ingredient is covered by at least one pre-normalized inventory item. */
function ingredientMatchesNormalized(ing: RecipeIngredient, inventory: NormalizedInventoryItem[]): boolean 
{
  const nameLower = ing.name.toLowerCase().trim();
  if (!nameLower) return false;

  const candidates = inventory.filter((item) => nameMatchesItem(nameLower, item));
  if (candidates.length === 0) return false;

  if (hasQuantityRequirement(ing))
  {
    if (isPresenceOnlyUnit(ing.unit!)) return true;
    return candidatesCoverQuantity(candidates, Number(ing.quantity), ing.unit!);
  }

  return true;
}

/** Computes match data for each recipe (available/missing ingredients, percentage). */
export function computeRecipesWithMatch(recipes: Recipe[], inventory: InventoryItem[]): RecipeWithMatch[] 
{
  const normalizedInv = normalizeInventory(inventory);
  return recipes.map((recipe) => 
  {
    const relevantIngredients = recipe.ingredients.filter((ing) => ing.name.trim());
    const availableIngredients: RecipeIngredient[] = [];
    const missingIngredients: RecipeIngredient[] = [];

    for (const ingredient of relevantIngredients) 
    {
      if (ingredientMatchesNormalized(ingredient, normalizedInv)) 
      {
        availableIngredients.push(ingredient);
      }
      else 
      {
        missingIngredients.push(ingredient);
      }
    }
    const totalIngredientsCount = relevantIngredients.length;
    const matchPercentage = totalIngredientsCount > 0 
      ? (availableIngredients.length / totalIngredientsCount) * 100 
      : 0;
    return {
      ...recipe,
      availableIngredients: availableIngredients,
      missingIngredients: missingIngredients,
      matchPercentage,
      totalIngredientsCount,
    };
  });
}
