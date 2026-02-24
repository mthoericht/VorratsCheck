/**
 * API integration tests for protected resources: must-have, wishlist, categories, recipes, deals.
 * Uses the app's API client against the test database. Run with: npm run test:integration:api
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  signup,
  getMustHave,
  createMustHaveItem,
  updateMustHaveItem,
  deleteMustHaveItem,
  getWishlist,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  getCategories,
  createCategory,
  deleteCategory,
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getDeals,
  isApiError,
} from '../../../src/app/lib/api';
import { prisma } from '../../../server/lib/prisma';

const INVITE_CODE = process.env.INVITE_CODE ?? 'VORRATSCHECK2026';

function setToken(token: string) 
{
  localStorage.setItem('vorratscheck_token', token);
}

describe('Must-have API (GET/POST/PATCH/DELETE /api/must-have)', () =>
{
  beforeEach(async () =>
  {
    await prisma.mustHaveItem.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  it('returns 401 without token', async () =>
  {
    try
    {
      await getMustHave();
      expect.fail('expected getMustHave to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 401).toBe(true);
    }
  });

  it('returns empty list then created item', async () =>
  {
    const { token } = await signup<{ token: string }>('mhuser', 'mh@example.com', 'secret', INVITE_CODE);
    setToken(token);

    const empty = await getMustHave<unknown[]>();
    expect(empty).toEqual([]);

    const created = await createMustHaveItem<{ id: string; name: string; minQuantity: number }>({
      name: 'Milch',
      minQuantity: 2,
    });
    expect(created.name).toBe('Milch');
    expect(created.minQuantity).toBe(2);

    const list = await getMustHave<{ id: string; name: string; minQuantity: number }[]>();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Milch');

    const updated = await updateMustHaveItem<{ name: string; minQuantity: number }>(created.id, {
      name: 'Milch',
      minQuantity: 3,
    });
    expect(updated.minQuantity).toBe(3);

    await deleteMustHaveItem(created.id);
    const after = await getMustHave<unknown[]>();
    expect(after).toHaveLength(0);
  });

  it('returns 404 for update/delete of non-existent id', async () =>
  {
    const { token } = await signup<{ token: string }>('mhuser2', 'mh2@example.com', 'secret', INVITE_CODE);
    setToken(token);

    try
    {
      await updateMustHaveItem('non-existent', { name: 'X' });
      expect.fail('expected update to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 404).toBe(true);
    }

    try
    {
      await deleteMustHaveItem('non-existent');
      expect.fail('expected delete to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 404).toBe(true);
    }
  });
});

describe('Wishlist API (GET/POST/PATCH/DELETE /api/wishlist)', () =>
{
  beforeEach(async () =>
  {
    await prisma.wishListItem.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  it('returns 401 without token', async () =>
  {
    try
    {
      await getWishlist();
      expect.fail('expected getWishlist to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 401).toBe(true);
    }
  });

  it('creates and lists wishlist items', async () =>
  {
    const { token } = await signup<{ token: string }>('wluser', 'wl@example.com', 'secret', INVITE_CODE);
    setToken(token);

    const created = await createWishlistItem<{ id: string; name: string; priority: string }>({
      name: 'Käse',
      type: 'specific',
      priority: 'high',
    });
    expect(created.name).toBe('Käse');
    expect(created.priority).toBe('high');

    const list = await getWishlist<{ id: string; name: string; priority: string }[]>();
    expect(list).toHaveLength(1);

    const updated = await updateWishlistItem<{ priority: string }>(created.id, { priority: 'low' });
    expect(updated.priority).toBe('low');

    await deleteWishlistItem(created.id);
    const after = await getWishlist<unknown[]>();
    expect(after).toHaveLength(0);
  });
});

describe('Categories API (GET/POST/DELETE /api/categories)', () =>
{
  beforeEach(async () =>
  {
    await prisma.category.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.mustHaveItem.deleteMany({});
    await prisma.wishListItem.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  it('returns 401 without token', async () =>
  {
    try
    {
      await getCategories();
      expect.fail('expected getCategories to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 401).toBe(true);
    }
  });

  it('creates and lists categories', async () =>
  {
    const { token } = await signup<{ token: string }>('catuser', 'cat@example.com', 'secret', INVITE_CODE);
    setToken(token);

    const empty = await getCategories<{ id: string; name: string }[]>();
    expect(empty).toEqual([]);

    const created = await createCategory<{ id: string; name: string }>('Milchprodukte');
    expect(created.name).toBe('Milchprodukte');

    const list = await getCategories<{ id: string; name: string }[]>();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Milchprodukte');

    await deleteCategory(created.id);
    const after = await getCategories<unknown[]>();
    expect(after).toHaveLength(0);
  });

  it('rejects duplicate category name with 409', async () =>
  {
    const { token } = await signup<{ token: string }>('catuser2', 'cat2@example.com', 'secret', INVITE_CODE);
    setToken(token);

    await createCategory('Obst');
    await expect(createCategory('Obst')).rejects.toMatchObject({ status: 409 });
  });
});

describe('Recipes API (GET/POST/PATCH/DELETE /api/recipes)', () =>
{
  beforeEach(async () =>
  {
    await prisma.recipe.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  it('returns 401 without token', async () =>
  {
    try
    {
      await getRecipes();
      expect.fail('expected getRecipes to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 401).toBe(true);
    }
  });

  it('creates and lists recipes', async () =>
  {
    const { token } = await signup<{ token: string }>('recuser', 'rec@example.com', 'secret', INVITE_CODE);
    setToken(token);

    const created = await createRecipe<{ id: string; name: string; difficulty: string; servings: number }>({
      name: 'Pasta',
      ingredients: [{ name: 'Nudeln' }, { name: 'Tomatensauce' }],
      instructions: ['Kochen', 'Servieren'],
      cookingTime: 15,
      difficulty: 'easy',
      servings: 2,
    });
    expect(created.name).toBe('Pasta');
    expect(created.servings).toBe(2);

    const list = await getRecipes<{ id: string; name: string }[]>();
    expect(list).toHaveLength(1);

    const updated = await updateRecipe<{ servings: number }>(created.id, { servings: 4 });
    expect(updated.servings).toBe(4);

    await deleteRecipe(created.id);
    const after = await getRecipes<unknown[]>();
    expect(after).toHaveLength(0);
  });

  it('returns 404 for update/delete of non-existent recipe', async () =>
  {
    const { token } = await signup<{ token: string }>('recuser2', 'rec2@example.com', 'secret', INVITE_CODE);
    setToken(token);

    try
    {
      await updateRecipe('non-existent', { name: 'X' });
      expect.fail('expected update to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 404).toBe(true);
    }

    try
    {
      await deleteRecipe('non-existent');
      expect.fail('expected delete to throw');
    }
    catch (e)
    {
      expect(isApiError(e) && e.status === 404).toBe(true);
    }
  });
});

describe('Deals API (GET /api/deals)', () =>
{
  beforeEach(async () =>
  {
    await prisma.deal.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  it('returns list without auth (seeded or empty)', async () =>
  {
    const deals = await getDeals<unknown[]>();
    expect(Array.isArray(deals)).toBe(true);
  });

  it('returns list with auth', async () =>
  {
    const { token } = await signup<{ token: string }>('dealuser', 'deal@example.com', 'secret', INVITE_CODE);
    setToken(token);

    const deals = await getDeals<unknown[]>();
    expect(Array.isArray(deals)).toBe(true);
  });
});
