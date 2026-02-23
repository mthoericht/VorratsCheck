import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { isValidPriority, isValidWishlistType } from '../../shared/validation.js';
import { getUserId, asyncHandler } from '../lib/routeHelpers.js';

export const wishlistRouter = Router();
wishlistRouter.use(authMiddleware);

wishlistRouter.get('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const items = await prisma.wishListItem.findMany({ where: { userId } });
  res.json(
    items.map((i) => ({
      id: i.id,
      name: i.name,
      type: i.type as 'category' | 'specific',
      category: i.category ?? undefined,
      brand: i.brand ?? undefined,
      priority: i.priority as 'low' | 'medium' | 'high',
    }))
  );
}));

wishlistRouter.post('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { name, type, category, brand, priority } = req.body;
  if (!name || !type || !priority) 
  {
    res.status(400).json({ error: 'name, type und priority erforderlich' });
    return;
  }
  if (!isValidWishlistType(type))
  {
    res.status(400).json({ error: 'type muss "category" oder "specific" sein' });
    return;
  }
  if (!isValidPriority(priority))
  {
    res.status(400).json({ error: 'priority muss "low", "medium" oder "high" sein' });
    return;
  }
  const item = await prisma.wishListItem.create({
    data: {
      userId,
      name,
      type,
      category: category || null,
      brand: brand || null,
      priority,
    },
  });
  res.status(201).json({
    id: item.id,
    name: item.name,
    type: item.type as 'category' | 'specific',
    category: item.category ?? undefined,
    brand: item.brand ?? undefined,
    priority: item.priority as 'low' | 'medium' | 'high',
  });
}));

wishlistRouter.patch('/:id', asyncHandler(async (req, res) =>
{
  const userId = getUserId(req);
  const { id } = req.params;
  const { name, type, category, brand, priority } = req.body;
  const existing = await prisma.wishListItem.findFirst({ where: { id, userId } });
  if (!existing)
  {
    res.status(404).json({ error: 'Eintrag nicht gefunden' });
    return;
  }
  if (priority != null && !isValidPriority(priority))
  {
    res.status(400).json({ error: 'priority muss "low", "medium" oder "high" sein' });
    return;
  }
  if (type != null && !isValidWishlistType(type))
  {
    res.status(400).json({ error: 'type muss "category" oder "specific" sein' });
    return;
  }
  const item = await prisma.wishListItem.update({
    where: { id, userId },
    data: {
      ...(name != null && { name }),
      ...(type != null && { type }),
      ...(category !== undefined && { category: category || null }),
      ...(brand !== undefined && { brand: brand || null }),
      ...(priority != null && { priority }),
    },
  });
  res.json({
    id: item.id,
    name: item.name,
    type: item.type as 'category' | 'specific',
    category: item.category ?? undefined,
    brand: item.brand ?? undefined,
    priority: item.priority as 'low' | 'medium' | 'high',
  });
}));

wishlistRouter.delete('/:id', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { id } = req.params;
  const existing = await prisma.wishListItem.findFirst({ where: { id, userId } });
  if (!existing) 
  {
    res.status(404).json({ error: 'Eintrag nicht gefunden' });
    return;
  }
  await prisma.wishListItem.delete({ where: { id, userId } });
  res.status(204).send();
}));
