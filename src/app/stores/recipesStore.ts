import { create } from 'zustand';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../lib/api';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
}

interface RecipesState {
  items: Recipe[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  update: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useRecipesStore = create<RecipesState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await getRecipes<Recipe[]>();
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (recipe) => 
  {
    const created = await createRecipe<Recipe>(recipe);
    set({ items: [...get().items, created] });
  },

  update: async (id, updates) => 
  {
    const updated = await updateRecipe<Recipe>(id, updates);
    set({ items: get().items.map((r) => (r.id === id ? updated : r)) });
  },

  remove: async (id) => 
  {
    await deleteRecipe(id);
    set({ items: get().items.filter((r) => r.id !== id) });
  },
}));
