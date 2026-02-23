import { createResourceStore } from './createResourceStore';
import { getWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem } from '../lib/api';

export interface WishListItem {
  id: string;
  name: string;
  type: 'category' | 'specific';
  category?: string;
  brand?: string;
  priority: 'low' | 'medium' | 'high';
}

export const useWishlistStore = createResourceStore<WishListItem, Omit<WishListItem, 'id'>, Partial<Omit<WishListItem, 'id'>>>({
  fetchFn: () => getWishlist<WishListItem[]>(),
  createFn: (item) => createWishlistItem<WishListItem>(item as Record<string, unknown>),
  updateFn: (id, item) => updateWishlistItem<WishListItem>(id, item as Record<string, unknown>),
  deleteFn: deleteWishlistItem,
});
