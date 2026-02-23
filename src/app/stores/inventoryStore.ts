import { createResourceStore } from './createResourceStore';
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../lib/api';

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

export const useInventoryStore = createResourceStore<InventoryItem, Omit<InventoryItem, 'id' | 'addedDate'>, Partial<InventoryItem>>({
  fetchFn: () => getInventory<InventoryItem[]>(),
  createFn: (item) => createInventoryItem<InventoryItem>(item as Record<string, unknown>),
  updateFn: (id, updates) => updateInventoryItem<InventoryItem>(id, updates as Record<string, unknown>),
  deleteFn: deleteInventoryItem,
  insertAt: 'start',
});
