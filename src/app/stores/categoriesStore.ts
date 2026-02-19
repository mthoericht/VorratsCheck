import { create } from 'zustand';
import { getCategories, createCategory, deleteCategory } from '../lib/api';

export interface Category {
  id: string;
  name: string;
}

interface CategoriesState {
  items: Category[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await getCategories<Category[]>();
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (name) => 
  {
    const created = await createCategory<Category>(name);
    set({ items: [...get().items, created].sort((a, b) => a.name.localeCompare(b.name)) });
  },

  remove: async (id) => 
  {
    await deleteCategory(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
