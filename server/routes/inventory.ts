import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const inventoryRouter = Router();
inventoryRouter.use(authMiddleware);

inventoryRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const items = await prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { addedDate: 'desc' },
    });
    res.json(
      items.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        brand: i.brand ?? undefined,
        barcode: i.barcode ?? undefined,
        quantity: i.quantity,
        unit: i.unit,
        expiryDate: i.expiryDate?.toISOString().split('T')[0],
        location: i.location ?? undefined,
        addedDate: i.addedDate.toISOString().split('T')[0],
      }))
    );
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

inventoryRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { name, category, brand, barcode, quantity, unit, expiryDate, location } = req.body;
    if (!name || !category || quantity == null) 
    {
      res.status(400).json({ error: 'name, category und quantity erforderlich' });
      return;
    }
    const item = await prisma.inventoryItem.create({
      data: {
        userId,
        name,
        category,
        brand: brand || null,
        barcode: barcode || null,
        quantity: Number(quantity),
        unit: unit || 'Stück',
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        location: location || null,
      },
    });
    res.status(201).json({
      id: item.id,
      name: item.name,
      category: item.category,
      brand: item.brand ?? undefined,
      barcode: item.barcode ?? undefined,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate?.toISOString().split('T')[0],
      location: item.location ?? undefined,
      addedDate: item.addedDate.toISOString().split('T')[0],
    });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

inventoryRouter.patch('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.inventoryItem.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Eintrag nicht gefunden' });
      return;
    }
    const { name, category, brand, barcode, quantity, unit, expiryDate, location } = req.body;
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(category != null && { category }),
        ...(brand !== undefined && { brand: brand || null }),
        ...(barcode !== undefined && { barcode: barcode || null }),
        ...(quantity != null && { quantity: Number(quantity) }),
        ...(unit != null && { unit }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(location !== undefined && { location: location || null }),
      },
    });
    res.json({
      id: item.id,
      name: item.name,
      category: item.category,
      brand: item.brand ?? undefined,
      barcode: item.barcode ?? undefined,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate?.toISOString().split('T')[0],
      location: item.location ?? undefined,
      addedDate: item.addedDate.toISOString().split('T')[0],
    });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

inventoryRouter.delete('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.inventoryItem.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Eintrag nicht gefunden' });
      return;
    }
    await prisma.inventoryItem.delete({ where: { id } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
