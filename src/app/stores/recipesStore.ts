import { create } from 'zustand';
import { api } from '../lib/api';

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
      const items = await api<Recipe[]>('/api/recipes');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (recipe) => 
  {
    const created = await api<Recipe>('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
    set({ items: [...get().items, created] });
  },

  update: async (id, updates) => 
  {
    const updated = await api<Recipe>(`/api/recipes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    set({ items: get().items.map((r) => (r.id === id ? updated : r)) });
  },

  remove: async (id) => 
  {
    await api(`/api/recipes/${id}`, { method: 'DELETE' });
    set({ items: get().items.filter((r) => r.id !== id) });
  },
}));
