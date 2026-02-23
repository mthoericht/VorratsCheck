import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { getUserId, asyncHandler } from '../lib/routeHelpers.js';

export const categoriesRouter = Router();
categoriesRouter.use(authMiddleware);

categoriesRouter.get('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const items = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  res.json(items.map((i) => ({ id: i.id, name: i.name })));
}));

categoriesRouter.post('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { name } = req.body;
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) 
  {
    res.status(400).json({ error: 'name erforderlich' });
    return;
  }
  const existing = await prisma.category.findFirst({
    where: { userId, name: trimmed },
  });
  if (existing) 
  {
    res.status(409).json({ error: 'Kategorie existiert bereits' });
    return;
  }
  const item = await prisma.category.create({
    data: { userId, name: trimmed },
  });
  res.status(201).json({ id: item.id, name: item.name });
}));

categoriesRouter.delete('/:id', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { id } = req.params;
  const existing = await prisma.category.findFirst({ where: { id, userId } });
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
    prisma.mustHaveItem.findMany({
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
    ...mustHaveUsing.map((i) => i.name),
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

  await prisma.category.delete({ where: { id, userId } });
  res.status(204).send();
}));
