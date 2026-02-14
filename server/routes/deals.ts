import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const dealsRouter = Router();
dealsRouter.use(authMiddleware);

function mapDeal(d: {
  id: string;
  product: string;
  category: string;
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
    category: d.category,
    store: d.store,
    originalPrice: d.originalPrice,
    discountPrice: d.discountPrice,
    discount: d.discount,
    validUntil: d.validUntil.toISOString().split('T')[0],
    distance: d.distance,
    inStock: d.inStock ?? true,
  };
}

dealsRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const deals = await prisma.deal.findMany({
      where: { OR: [{ userId: null }, { userId }] },
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

dealsRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { product, category, store, originalPrice, discountPrice, discount, validUntil, distance, inStock } = req.body;
    if (!product || !category || !store || originalPrice == null || discountPrice == null || discount == null || !validUntil || distance == null) 
    {
      res.status(400).json({ error: 'product, category, store, originalPrice, discountPrice, discount, validUntil, distance erforderlich' });
      return;
    }
    const deal = await prisma.deal.create({
      data: {
        userId,
        product,
        category,
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

dealsRouter.delete('/:id', async (req: Request, res: Response) => 
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
    await prisma.deal.delete({ where: { id } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
