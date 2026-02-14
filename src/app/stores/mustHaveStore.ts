import { create } from 'zustand';
import { api } from '../lib/api';

export interface MustHaveItem {
  id: string;
  name: string;
  category?: string;
  minQuantity: number;
}

interface MustHaveState {
  items: MustHaveItem[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (item: Omit<MustHaveItem, 'id'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useMustHaveStore = create<MustHaveState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await api<MustHaveItem[]>('/api/must-have');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (item) => 
  {
    const created = await api<MustHaveItem>('/api/must-have', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    set({ items: [...get().items, created] });
  },

  remove: async (id) => 
  {
    await api(`/api/must-have/${id}`, { method: 'DELETE' });
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
