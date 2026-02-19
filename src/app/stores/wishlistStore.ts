import { create } from 'zustand';
import { getWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem } from '../lib/api';

export interface WishListItem {
  id: string;
  name: string;
  type: 'category' | 'specific';
  category?: string;
  brand?: string;
  priority: 'low' | 'medium' | 'high';
}

interface WishListState {
  items: WishListItem[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (item: Omit<WishListItem, 'id'>) => Promise<void>;
  update: (id: string, item: Partial<Omit<WishListItem, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useWishlistStore = create<WishListState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await getWishlist<WishListItem[]>();
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (item) =>
  {
    const created = await createWishlistItem<WishListItem>(item);
    set({ items: [...get().items, created] });
  },

  update: async (id, item) =>
  {
    const updated = await updateWishlistItem<WishListItem>(id, item);
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },

  remove: async (id) =>
  {
    await deleteWishlistItem(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
