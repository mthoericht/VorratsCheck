import { createResourceStore } from './createResourceStore';
import { getMustHave, createMustHaveItem, updateMustHaveItem, deleteMustHaveItem } from '../lib/api';

export interface MustHaveItem {
  id: string;
  name: string;
  category?: string;
  minQuantity: number;
  unit?: string;
}

export const useMustHaveStore = createResourceStore<MustHaveItem, Omit<MustHaveItem, 'id'>, Partial<Omit<MustHaveItem, 'id'>>>({
  fetchFn: () => getMustHave<MustHaveItem[]>(),
  createFn: (item) => createMustHaveItem<MustHaveItem>(item as Record<string, unknown>),
  updateFn: (id, item) => updateMustHaveItem<MustHaveItem>(id, item as Record<string, unknown>),
  deleteFn: deleteMustHaveItem,
});
