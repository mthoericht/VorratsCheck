// Fehler und Hilfsfunktionen
export { ApiError, isApiError, getErrorMessage } from './errors';

// Auth-Helfer (z. B. für eigene Requests)
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
export { getWishlist, createWishlistItem, deleteWishlistItem } from './wishlist';

// Categories
export { getCategories, createCategory, deleteCategory } from './categories';

// Recipes
export { getRecipes, createRecipe, updateRecipe, deleteRecipe } from './recipes';

// Deals
export { getDeals } from './deals';

// Auth
export { login, signup } from './auth';
