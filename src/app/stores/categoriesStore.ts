import { create } from 'zustand';
import { api } from '../lib/api';

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
      const items = await api<Category[]>('/api/categories');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (name) => 
  {
    const created = await api<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim() }),
    });
    set({ items: [...get().items, created].sort((a, b) => a.name.localeCompare(b.name)) });
  },

  remove: async (id) => 
  {
    await api(`/api/categories/${id}`, { method: 'DELETE' });
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
