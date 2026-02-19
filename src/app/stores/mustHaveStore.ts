import { create } from 'zustand';
import { getMustHave, createMustHaveItem, deleteMustHaveItem } from '../lib/api';

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

  remove: async (id) => 
  {
    await deleteMustHaveItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
