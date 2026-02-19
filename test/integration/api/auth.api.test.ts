/**
 * API integration tests: use the app's API client (login, signup, getInventory, etc.)
 * against the test database. Run with: npm run test:integration:api
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { signup, login, getInventory, createInventoryItem, isApiError } from '../../../src/app/lib/api';
import { prisma } from '../../../server/lib/prisma';

const INVITE_CODE = process.env.INVITE_CODE ?? 'VORRATSCHECK2026';

describe('API integration (test DB)', () =>
{
  beforeEach(async () =>
  {
    await prisma.inventoryItem.deleteMany({});
    await prisma.mustHaveItem.deleteMany({});
    await prisma.wishListItem.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.deal.deleteMany({});
    await prisma.user.deleteMany({});
    localStorage.removeItem('vorratscheck_token');
  });

  describe('signup (POST /api/auth/signup)', () =>
  {
    it('creates user and returns token', async () =>
    {
      const res = await signup<{ token: string; user: { id: string; username: string; email: string } }>(
        'testuser',
        'test@example.com',
        'secret123',
        INVITE_CODE
      );

      expect(res).toHaveProperty('token');
      expect(res.user).toEqual({
        id: expect.any(String),
        username: 'testuser',
        email: 'test@example.com',
      });

      const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
      expect(user).not.toBeNull();
      expect(user?.username).toBe('testuser');
    });

    it('rejects invalid invite code', async () =>
    {
      await expect(
        signup('testuser', 'test@example.com', 'secret123', 'wrong')
      ).rejects.toMatchObject({ status: 400 });
    });
  });

  describe('login (POST /api/auth/login)', () =>
  {
    beforeEach(async () =>
    {
      await signup('loginuser', 'login@example.com', 'mypassword', INVITE_CODE);
    });

    it('returns token for valid credentials', async () =>
    {
      const res = await login<{ token: string; user: { email: string } }>('login@example.com', 'mypassword');

      expect(res).toHaveProperty('token');
      expect(res.user.email).toBe('login@example.com');
    });

    it('throws for wrong password', async () =>
    {
      try
      {
        await login('login@example.com', 'wrong');
        expect.fail('expected login to throw');
      }
      catch (e)
      {
        expect(isApiError(e) && e.status === 401).toBe(true);
      }
    });
  });

  describe('getInventory (GET /api/inventory, protected)', () =>
  {
    it('throws 401 without token', async () =>
    {
      try
      {
        await getInventory();
        expect.fail('expected getInventory to throw');
      }
      catch (e)
      {
        expect(isApiError(e) && e.status === 401).toBe(true);
      }
    });

    it('returns empty array for authenticated user with no items', async () =>
    {
      const signupRes = await signup<{ token: string }>(
        'invuser',
        'inv@example.com',
        'secret',
        INVITE_CODE
      );
      localStorage.setItem('vorratscheck_token', signupRes.token);

      const items = await getInventory();
      expect(items).toEqual([]);
    });

    it('returns inventory items for authenticated user', async () =>
    {
      const signupRes = await signup<{ token: string }>(
        'invuser2',
        'inv2@example.com',
        'secret',
        INVITE_CODE
      );
      localStorage.setItem('vorratscheck_token', signupRes.token);

      await createInventoryItem({
        name: 'Milch',
        category: 'Milchprodukte',
        quantity: 2,
        unit: 'l',
      });

      const items = (await getInventory()) as { name: string; quantity: number }[];
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Milch');
      expect(items[0].quantity).toBe(2);
    });
  });

  describe('GET /api/health', () =>
  {
    it('returns ok without auth', async () =>
    {
      const base = process.env.VITE_API_URL ?? '';
      const res = await fetch(`${base}/api/health`);
      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(data).toEqual({ ok: true });
    });
  });
});
