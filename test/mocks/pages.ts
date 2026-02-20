/**
 * Shared mock data for Page stories (Storybook) and unit/integration tests.
 * Types match the app stores; use with store.setState() in decorators or tests.
 */
import type { InventoryItem } from '../../src/app/stores/inventoryStore';
import type { MustHaveItem } from '../../src/app/stores/mustHaveStore';
import type { WishListItem } from '../../src/app/stores/wishlistStore';
import type { Category } from '../../src/app/stores/categoriesStore';
import type { Recipe } from '../../src/app/stores/recipesStore';
import type { Deal } from '../../src/app/stores/dealsStore';

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Milch',
    category: 'Milchprodukte',
    brand: 'Bio',
    quantity: 2,
    unit: 'l',
    expiryDate: '2025-03-01',
    location: 'Kühlschrank',
    addedDate: '2025-01-15',
  },
  {
    id: 'inv-2',
    name: 'Joghurt',
    category: 'Milchprodukte',
    quantity: 4,
    unit: 'stk',
    expiryDate: '2025-01-25',
    location: 'Kühlschrank',
    addedDate: '2025-01-10',
  },
  {
    id: 'inv-3',
    name: 'Olivenöl',
    category: 'Öle',
    brand: 'Bio',
    quantity: 1,
    unit: 'l',
    expiryDate: '2026-12-31',
    location: 'Vorratsschrank',
    addedDate: '2025-01-01',
  },
];

export const mockMustHave: MustHaveItem[] = [
  { id: 'mh-1', name: 'Milch', category: 'Milchprodukte', minQuantity: 2 },
  { id: 'mh-2', name: 'Butter', category: 'Milchprodukte', minQuantity: 1 },
  { id: 'mh-3', name: 'Eier', category: 'Eier', minQuantity: 6, unit: 'stk' },
];

export const mockWishlist: WishListItem[] = [
  { id: 'wl-1', name: 'Olivenöl', type: 'specific', category: 'Öle', priority: 'high' },
  { id: 'wl-2', name: 'Parmesan', type: 'specific', priority: 'high' },
  { id: 'wl-3', name: 'Pasta', type: 'specific', category: 'Nudeln', priority: 'medium' },
  { id: 'wl-4', name: 'Snacks', type: 'specific', priority: 'low' },
];

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Milchprodukte' },
  { id: 'cat-2', name: 'Öle' },
  { id: 'cat-3', name: 'Getränke' },
  { id: 'cat-4', name: 'Nudeln' },
];

export const mockRecipes: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Pasta mit Olivenöl',
    ingredients: [
      { name: 'Pasta', quantity: 400, unit: 'g' },
      { name: 'Olivenöl', quantity: 2, unit: 'EL' },
      { name: 'Salz' },
    ],
    instructions: ['Wasser kochen.', 'Pasta kochen.', 'Mit Öl und Salz servieren.'],
    cookingTime: 15,
    difficulty: 'easy',
    servings: 2,
  },
  {
    id: 'rec-2',
    name: 'Joghurt mit Obst',
    ingredients: [
      { name: 'Joghurt', quantity: 200, unit: 'g' },
      { name: 'Obst' },
    ],
    instructions: ['Joghurt in Schale geben.', 'Obst dazu geben.'],
    cookingTime: 5,
    difficulty: 'easy',
    servings: 1,
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    product: 'Bio-Milch',
    name: 'Milchprodukte',
    store: 'Rewe',
    originalPrice: 1.39,
    discountPrice: 0.99,
    discount: 29,
    validUntil: '2025-02-28',
    distance: 0.5,
    inStock: true,
  },
  {
    id: 'deal-2',
    product: 'Butter',
    name: 'Milchprodukte',
    store: 'Edeka',
    originalPrice: 2.49,
    discountPrice: 1.99,
    discount: 20,
    validUntil: '2025-02-25',
    distance: 1.2,
  },
  {
    id: 'deal-3',
    product: 'Olivenöl nativ',
    name: 'Öle',
    store: 'Rewe',
    originalPrice: 5.99,
    discountPrice: 4.49,
    discount: 25,
    validUntil: '2025-03-01',
    distance: 0.5,
    inStock: true,
  },
  {
    id: 'deal-4',
    product: 'Pasta Spaghetti',
    name: 'Nudeln',
    store: 'Edeka',
    originalPrice: 1.29,
    discountPrice: 0.99,
    discount: 23,
    validUntil: '2025-02-20',
    distance: 1.2,
  },
];

/** Empty arrays for "empty state" stories and tests. */
export const emptyInventory: InventoryItem[] = [];
export const emptyMustHave: MustHaveItem[] = [];
export const emptyWishlist: WishListItem[] = [];
export const emptyCategories: Category[] = [];
export const emptyRecipes: Recipe[] = [];
export const emptyDeals: Deal[] = [];
