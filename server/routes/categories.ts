import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

// Cast to access Category delegate when TS PrismaClient types are out of sync with schema (e.g. after adding Category model)
const category = (prisma as unknown as { category: { findMany: (args: unknown) => Promise<{ id: string; name: string }[]>; findFirst: (args: unknown) => Promise<{ id: string; name: string } | null>; create: (args: unknown) => Promise<{ id: string; name: string }>; delete: (args: unknown) => Promise<unknown> } }).category;

export const categoriesRouter = Router();
categoriesRouter.use(authMiddleware);

categoriesRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const items = await category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    res.json(items.map((i) => ({ id: i.id, name: i.name })));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

categoriesRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { name } = req.body;
    const trimmed = typeof name === 'string' ? name.trim() : '';
    if (!trimmed) 
    {
      res.status(400).json({ error: 'name erforderlich' });
      return;
    }
    const existing = await category.findFirst({
      where: { userId, name: trimmed },
    });
    if (existing) 
    {
      res.status(409).json({ error: 'Kategorie existiert bereits' });
      return;
    }
    const item = await category.create({
      data: { userId, name: trimmed },
    });
    res.status(201).json({ id: item.id, name: item.name });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

categoriesRouter.delete('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await category.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Kategorie nicht gefunden' });
      return;
    }

    const categoryName = existing.name;

    const [inventoryUsing, mustHaveUsing, wishlistUsing] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: { userId, category: categoryName },
        select: { name: true },
        take: 3,
      }),
      // MustHaveItem has name in schema; cast to avoid stale Prisma types
      (prisma.mustHaveItem as unknown as { findMany: (args: unknown) => Promise<{ name: string }[]> }).findMany({
        where: { userId, category: categoryName },
        select: { name: true },
        take: 3,
      }),
      prisma.wishListItem.findMany({
        where: { userId, category: categoryName },
        select: { name: true },
        take: 3,
      }),
    ]);

    const usedByNames = [
      ...inventoryUsing.map((i) => i.name),
      ...(mustHaveUsing as unknown as Array<{ name: string }>).map((i) => i.name),
      ...wishlistUsing.map((i) => i.name),
    ].slice(0, 3);

    if (usedByNames.length > 0) 
    {
      const examples = usedByNames.join(', ');
      res.status(409).json({
        error: `Kategorie wird noch verwendet und kann nicht gelöscht werden. Verwendet u. a. von: ${examples}`,
      });
      return;
    }

    await category.delete({ where: { id } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
