// Errors and helpers
export { ApiError, isApiError, getErrorMessage } from './errors';

// Auth helpers (e.g. for custom requests)
export { getAuthHeader } from './client';

// Inventory
export {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from './inventory';

// Must-have
export { getMustHave, createMustHaveItem, updateMustHaveItem, deleteMustHaveItem } from './mustHave';

// Wishlist
export { getWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem } from './wishlist';

// Categories
export { getCategories, createCategory, deleteCategory } from './categories';

// Recipes
export { getRecipes, createRecipe, updateRecipe, deleteRecipe, importRecipe } from './recipes';
export type { ImportedRecipe } from './recipes';

// Deals
export { getDeals } from './deals';

// Auth
export { login, signup } from './auth';
