import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { isValidPriority, isValidWishlistType } from '../../shared/validation.js';

export const wishlistRouter = Router();
wishlistRouter.use(authMiddleware);

wishlistRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
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
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

wishlistRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
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
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

wishlistRouter.patch('/:id', async (req: Request, res: Response) =>
{
  try
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
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
  }
  catch (e)
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

wishlistRouter.delete('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.wishListItem.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Eintrag nicht gefunden' });
      return;
    }
    await prisma.wishListItem.delete({ where: { id, userId } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
