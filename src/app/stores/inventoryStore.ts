import { create } from 'zustand';
import { api } from '../lib/api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand?: string;
  barcode?: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  location?: string;
  addedDate: string;
}

interface InventoryState {
  items: InventoryItem[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (item: Omit<InventoryItem, 'id' | 'addedDate'>) => Promise<void>;
  update: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loaded: false,

  fetch: async () => 
  {
    try 
    {
      const items = await api<InventoryItem[]>('/api/inventory');
      set({ items, loaded: true });
    }
    catch 
    {
      set({ loaded: true });
    }
  },

  add: async (item) => 
  {
    const created = await api<InventoryItem>('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    set({ items: [created, ...get().items] });
  },

  update: async (id, updates) => 
  {
    const updated = await api<InventoryItem>(`/api/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    set({ items: get().items.map((i) => (i.id === id ? updated : i)) });
  },

  remove: async (id) => 
  {
    await api(`/api/inventory/${id}`, { method: 'DELETE' });
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));
