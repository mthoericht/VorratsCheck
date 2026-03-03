import { createCrud } from './crud';
import { api } from './client';

const crud = createCrud('/api/recipes');

export const getRecipes = crud.get;
export const createRecipe = crud.create;
export const updateRecipe = crud.update;
export const deleteRecipe = crud.delete;

export interface ImportedRecipe {
  name: string;
  ingredients: { name: string; quantity?: number; unit?: string }[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  sourceUrl: string;
}

export const importRecipe = (url: string) =>
  api<ImportedRecipe>('/api/recipes/import', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
