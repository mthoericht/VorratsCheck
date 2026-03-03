import { describe, it, expect } from 'vitest';
import {
  formatIngredient,
  filterRecipesBySearch,
  getDifficultyColor,
  getDifficultyLabel,
  ingredientMatches,
  computeRecipesWithMatch,
} from '@/app/lib/recipe';
import type { InventoryItem } from '@/app/stores/inventoryStore';
import type { Recipe } from '@/app/stores/recipesStore';

/** Minimal recipe-like shape for search tests. */
function recipe(name: string, ingredientNames: string[]): { name: string; ingredients: { name: string }[] } 
{
  return {
    name,
    ingredients: ingredientNames.map((name) => ({ name })),
  };
}

describe('recipe', () => 
{
  describe('filterRecipesBySearch', () => 
  {
    const recipes = [
      recipe('Spaghetti Bolognese', ['Spaghetti', 'Hackfleisch', 'Tomaten', 'Zwiebeln']),
      recipe('Kartoffelsalat', ['Kartoffeln', 'Mayo', 'Gurke']),
      recipe('Tomatensuppe', ['Tomaten', 'Zwiebeln', 'Basilikum']),
    ];

    it('returns all recipes when search is empty', () => 
    {
      expect(filterRecipesBySearch(recipes, '')).toEqual(recipes);
      expect(filterRecipesBySearch(recipes, '   ')).toEqual(recipes);
    });

    it('matches by recipe name (substring, case-insensitive)', () => 
    {
      expect(filterRecipesBySearch(recipes, 'Bolognese')).toHaveLength(1);
      expect(filterRecipesBySearch(recipes, 'Bolognese')[0].name).toBe('Spaghetti Bolognese');
      expect(filterRecipesBySearch(recipes, 'kartoffel')).toHaveLength(1);
      expect(filterRecipesBySearch(recipes, 'KARTOFFEL')[0].name).toBe('Kartoffelsalat');
      expect(filterRecipesBySearch(recipes, 'tomat')).toHaveLength(2); // Tomatensuppe, and Spaghetti has Tomaten
    });

    it('matches by ingredient name (substring, case-insensitive)', () => 
    {
      expect(filterRecipesBySearch(recipes, 'Hackfleisch')).toHaveLength(1);
      expect(filterRecipesBySearch(recipes, 'hackfleisch')[0].name).toBe('Spaghetti Bolognese');
      expect(filterRecipesBySearch(recipes, 'Mayo')).toHaveLength(1);
      expect(filterRecipesBySearch(recipes, 'zwiebeln')).toHaveLength(2); // Bolognese, Tomatensuppe
      expect(filterRecipesBySearch(recipes, 'Tomaten')).toHaveLength(2); // both have Tomaten
    });

    it('returns empty array when no recipe matches', () => 
    {
      expect(filterRecipesBySearch(recipes, 'Pizza')).toHaveLength(0);
      expect(filterRecipesBySearch(recipes, 'xyz')).toHaveLength(0);
    });

    it('preserves original order of matching recipes', () => 
    {
      const result = filterRecipesBySearch(recipes, 'Tomaten');
      expect(result.map((r) => r.name)).toEqual(['Spaghetti Bolognese', 'Tomatensuppe']);
    });
  });

  describe('formatIngredient', () => 
  {
    it('formats with quantity and unit', () => 
    {
      expect(formatIngredient({ name: 'Spaghetti', quantity: 400, unit: 'g' })).toBe(
        '400 g Spaghetti'
      );
    });

    it('returns only name when no quantity/unit', () => 
    {
      expect(formatIngredient({ name: 'Salz' })).toBe('Salz');
    });

    it('returns empty string for empty name', () => 
    {
      expect(formatIngredient({ name: '' })).toBe('');
    });
  });

  describe('getDifficultyColor', () => 
  {
    it('returns correct Tailwind classes for easy/medium/hard', () => 
    {
      expect(getDifficultyColor('easy')).toBe('bg-green-100 text-green-800');
      expect(getDifficultyColor('medium')).toBe('bg-yellow-100 text-yellow-800');
      expect(getDifficultyColor('hard')).toBe('bg-red-100 text-red-800');
    });

    it('returns default for unknown', () => 
    {
      expect(getDifficultyColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getDifficultyLabel', () => 
  {
    it('returns German labels', () => 
    {
      expect(getDifficultyLabel('easy')).toBe('Einfach');
      expect(getDifficultyLabel('medium')).toBe('Mittel');
      expect(getDifficultyLabel('hard')).toBe('Schwer');
    });
  });

  describe('ingredientMatches', () => 
  {
    const inventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Vollmilch',
        category: 'Milchprodukte',
        quantity: 2,
        unit: 'l', // Liter
        addedDate: '2025-01-01',
      },
      {
        id: '2',
        name: 'Spaghetti',
        category: 'Pasta',
        quantity: 500,
        unit: 'g',
        addedDate: '2025-01-01',
      },
    ];

    it('matches by name at word boundary', () => 
    {
      expect(ingredientMatches({ name: 'Spaghetti', quantity: 400, unit: 'g' }, inventory)).toBe(true);
    });

    it('does not match mid-word (e.g. Milch in Vollmilch)', () => 
    {
      expect(ingredientMatches({ name: 'Milch' }, inventory)).toBe(false);
    });

    it('matches without quantity when name matches', () => 
    {
      expect(ingredientMatches({ name: 'Spaghetti' }, inventory)).toBe(true);
    });

    it('returns false when not enough quantity', () => 
    {
      expect(ingredientMatches({ name: 'Spaghetti', quantity: 1000, unit: 'g' }, inventory)).toBe(
        false
      );
    });

    it('returns false when no inventory match', () => 
    {
      expect(ingredientMatches({ name: 'Parmesan' }, inventory)).toBe(false);
    });

    it('matches by presence only for Zehen/Kugeln (ignores quantity)', () => 
    {
      const inv = [
        { id: '1', name: 'Knoblauch', category: 'Gemüse', quantity: 1, unit: 'Zehen', addedDate: '2025-01-01' },
        { id: '2', name: 'Mozzarella', category: 'Milchprodukte', quantity: 1, unit: 'Kugeln', addedDate: '2025-01-01' },
      ] as InventoryItem[];
      expect(ingredientMatches({ name: 'Knoblauch', quantity: 4, unit: 'Zehen' }, inv)).toBe(true);
      expect(ingredientMatches({ name: 'Mozzarella', quantity: 2, unit: 'Kugeln' }, inv)).toBe(true);
      expect(ingredientMatches({ name: 'Knoblauch', quantity: 4, unit: 'Zehen' }, [])).toBe(false);
    });
  });

  describe('computeRecipesWithMatch', () => 
  {
    const inventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Nudeln',
        category: 'Pasta',
        quantity: 500,
        unit: 'g',
        addedDate: '2025-01-01',
      },
    ];

    const recipes: Recipe[] = [
      {
        id: '1',
        name: 'Pasta',
        ingredients: [
          { name: 'Nudeln', quantity: 400, unit: 'g' },
          { name: 'Salz' },
        ],
        instructions: [],
        cookingTime: 10,
        difficulty: 'easy',
        servings: 2,
      },
    ];

    it('computes match percentage and available/missing', () => 
    {
      const result = computeRecipesWithMatch(recipes, inventory);
      expect(result).toHaveLength(1);
      expect(result[0].totalIngredientsCount).toBe(2);
      expect(result[0].availableIngredients).toHaveLength(1); // Nudeln from inventory
      expect(result[0].missingIngredients).toHaveLength(1);   // Salz not in inventory
      expect(result[0].matchPercentage).toBe(50);
    });
  });
});
