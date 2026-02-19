import { useInventoryStore } from '../../../../src/app/stores/inventoryStore';
import { useMustHaveStore } from '../../../../src/app/stores/mustHaveStore';
import { useWishlistStore } from '../../../../src/app/stores/wishlistStore';
import { useCategoriesStore } from '../../../../src/app/stores/categoriesStore';
import { useRecipesStore } from '../../../../src/app/stores/recipesStore';
import { useDealsStore } from '../../../../src/app/stores/dealsStore';

/** Partial store state for loader (only data fields we set in stories). */
export type StoreValues = {
  inventory?: Partial<Pick<ReturnType<typeof useInventoryStore.getState>, 'items' | 'loaded'>>;
  mustHave?: Partial<Pick<ReturnType<typeof useMustHaveStore.getState>, 'items' | 'loaded'>>;
  wishlist?: Partial<Pick<ReturnType<typeof useWishlistStore.getState>, 'items' | 'loaded'>>;
  categories?: Partial<Pick<ReturnType<typeof useCategoriesStore.getState>, 'items' | 'loaded'>>;
  recipes?: Partial<Pick<ReturnType<typeof useRecipesStore.getState>, 'items' | 'loaded'>>;
  deals?: Partial<Pick<ReturnType<typeof useDealsStore.getState>, 'items' | 'loaded'>>;
};

const storeMap = {
  inventory: useInventoryStore,
  mustHave: useMustHaveStore,
  wishlist: useWishlistStore,
  categories: useCategoriesStore,
  recipes: useRecipesStore,
  deals: useDealsStore,
} as const;

/**
 * Applies store values synchronously. Use in decorators so Docs tab and Canvas
 * both show the correct data (loaders are not always run for Docs preview).
 */
export function applyStoreValues(values: StoreValues): void
{
  for (const [key, val] of Object.entries(values))
  {
    if (val) (storeMap[key as keyof typeof storeMap].setState as (v: unknown) => void)(val);
  }
}

/**
 * Creates a Storybook loader that populates Zustand stores before the story renders.
 * Loaders run before any rendering, ensuring stores are populated when
 * the component mounts.
 */
export function storeLoader(values: StoreValues)
{
  return async () =>
  {
    applyStoreValues(values);
    return {};
  };
}
