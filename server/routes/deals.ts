import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { isValidNumber, isValidDate } from '../../shared/validation.js';

export const dealsRouter = Router();

function mapDeal(d: {
  id: string;
  product: string;
  name: string;
  store: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  validUntil: Date;
  distance: number;
  inStock: boolean | null;
}) 
{
  return {
    id: d.id,
    product: d.product,
    name: d.name,
    store: d.store,
    originalPrice: d.originalPrice,
    discountPrice: d.discountPrice,
    discount: d.discount,
    validUntil: d.validUntil.toISOString().split('T')[0],
    distance: d.distance,
    inStock: d.inStock ?? true,
  };
}

dealsRouter.get('/', optionalAuth, async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    const deals = await prisma.deal.findMany({
      where: userId ? { OR: [{ userId: null }, { userId }] } : { userId: null },
      orderBy: { validUntil: 'asc' },
    });
    res.json(deals.map(mapDeal));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

dealsRouter.post('/', authMiddleware, async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { product, name, store, originalPrice, discountPrice, discount, validUntil, distance, inStock } = req.body;
    if (!product || !store || originalPrice == null || discountPrice == null || discount == null || !validUntil || distance == null) 
    {
      res.status(400).json({ error: 'product, store, originalPrice, discountPrice, discount, validUntil, distance erforderlich' });
      return;
    }
    if (!isValidNumber(originalPrice) || !isValidNumber(discountPrice) || !isValidNumber(discount) || !isValidNumber(distance))
    {
      res.status(400).json({ error: 'Preise, Rabatt und Entfernung müssen gültige Zahlen sein' });
      return;
    }
    if (!isValidDate(validUntil))
    {
      res.status(400).json({ error: 'validUntil muss ein gültiges Datum sein' });
      return;
    }
    const dealName = name || 'Sonstiges';
    const deal = await prisma.deal.create({
      data: {
        userId,
        product,
        name: dealName,
        store,
        originalPrice: Number(originalPrice),
        discountPrice: Number(discountPrice),
        discount: Number(discount),
        validUntil: new Date(validUntil),
        distance: Number(distance),
        inStock: inStock !== undefined ? !!inStock : null,
      },
    });
    res.status(201).json(mapDeal(deal));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

dealsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.deal.findFirst({ where: { id, userId: userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Angebot nicht gefunden' });
      return;
    }
    await prisma.deal.delete({ where: { id, userId: userId } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
