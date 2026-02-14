import { create } from 'zustand';
import { api } from '../lib/api';

export interface Deal {
  id: string;
  product: string;
  category: string;
  store: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  validUntil: string;
  distance: number;
  inStock?: boolean;
}

interface DealsState {
  items: Deal[];
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useDealsStore = create<DealsState>((set) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await api<Deal[]>('/api/deals');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },
}));
