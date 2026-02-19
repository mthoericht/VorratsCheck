import { create } from 'zustand';
import { getMustHave, createMustHaveItem, updateMustHaveItem, deleteMustHaveItem } from '../lib/api';

export interface MustHaveItem {
  id: string;
  name: string;
  category?: string;
  minQuantity: number;
  unit?: string;
}

interface MustHaveState {
  items: MustHaveItem[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (item: Omit<MustHaveItem, 'id'>) => Promise<void>;
  update: (id: string, item: Partial<Omit<MustHaveItem, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useMustHaveStore = create<MustHaveState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await getMustHave<MustHaveItem[]>();
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (item) => 
  {
    const created = await createMustHaveItem<MustHaveItem>(item);
    set({ items: [...get().items, created] });
  },

  update: async (id, item) => 
  {
    const updated = await updateMustHaveItem<MustHaveItem>(id, item);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },

  remove: async (id) => 
  {
    await deleteMustHaveItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
