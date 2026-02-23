import { createResourceStore } from './createResourceStore';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../lib/api';

import type { RecipeIngredient } from '../lib/recipe';
import type { Difficulty } from '@shared/constants';

export interface Recipe 
{
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookingTime: number;
  difficulty: Difficulty;
  servings: number;
}

export const useRecipesStore = createResourceStore<Recipe, Omit<Recipe, 'id'>, Partial<Recipe>>({
  fetchFn: () => getRecipes<Recipe[]>(),
  createFn: (recipe) => createRecipe<Recipe>(recipe as Record<string, unknown>),
  updateFn: (id, updates) => updateRecipe<Recipe>(id, updates as Record<string, unknown>),
  deleteFn: deleteRecipe,
});
