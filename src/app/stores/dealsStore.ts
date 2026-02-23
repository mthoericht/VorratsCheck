import { createResourceStore } from './createResourceStore';
import { getDeals } from '../lib/api';

export interface Deal {
  id: string;
  product: string;
  name: string; // category name for display (e.g. Milchprodukte, Schokolade)
  store: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  validUntil: string;
  distance: number;
  inStock?: boolean;
}

export const useDealsStore = createResourceStore<Deal>({
  fetchFn: () => getDeals<Deal[]>(),
});
