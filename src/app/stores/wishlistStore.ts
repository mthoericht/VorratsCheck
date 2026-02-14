import { create } from 'zustand';
import { api } from '../lib/api';

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
  remove: (id: string) => Promise<void>;
}

export const useWishlistStore = create<WishListState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await api<WishListItem[]>('/api/wishlist');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (item) => 
  {
    const created = await api<WishListItem>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    set({ items: [...get().items, created] });
  },

  remove: async (id) => 
  {
    await api(`/api/wishlist/${id}`, { method: 'DELETE' });
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
