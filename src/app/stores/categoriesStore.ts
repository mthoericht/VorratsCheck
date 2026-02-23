import { createResourceStore } from './createResourceStore';
import { getCategories, createCategory, deleteCategory } from '../lib/api';

export interface Category {
  id: string;
  name: string;
}

export const useCategoriesStore = createResourceStore<Category, string, never>({
  fetchFn: () => getCategories<Category[]>(),
  createFn: (name) => createCategory<Category>(name),
  deleteFn: deleteCategory,
  sort: (a, b) => a.name.localeCompare(b.name),
});
