import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { isValidNumber, isValidDate } from '../../shared/validation.js';
import { getUserId, getOptionalUserId, toISODate, asyncHandler } from '../lib/routeHelpers.js';

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
    validUntil: toISODate(d.validUntil),
    distance: d.distance,
    inStock: d.inStock ?? true,
  };
}

dealsRouter.get('/', optionalAuth, asyncHandler(async (req, res) => 
{
  const userId = getOptionalUserId(req);
  const deals = await prisma.deal.findMany({
    where: userId ? { OR: [{ userId: null }, { userId }] } : { userId: null },
    orderBy: { validUntil: 'asc' },
  });
  res.json(deals.map(mapDeal));
}));

dealsRouter.post('/', authMiddleware, asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { product, name, store, originalPrice, discountPrice, discount, validUntil, distance, inStock } = req.body;
  if (!product || !store || originalPrice == null || discountPrice == null || discount == null || !validUntil || distance == null) 
  {
    res.status(400).json({ error: 'serverErrors.dealFieldsRequired' });
    return;
  }
  if (!isValidNumber(originalPrice) || !isValidNumber(discountPrice) || !isValidNumber(discount) || !isValidNumber(distance))
  {
    res.status(400).json({ error: 'serverErrors.invalidNumbers' });
    return;
  }
  if (!isValidDate(validUntil))
  {
    res.status(400).json({ error: 'serverErrors.invalidDate' });
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
}));

dealsRouter.delete('/:id', authMiddleware, asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { id } = req.params;
  const existing = await prisma.deal.findFirst({ where: { id, userId } });
  if (!existing) 
  {
    res.status(404).json({ error: 'serverErrors.dealNotFound' });
    return;
  }
  await prisma.deal.delete({ where: { id, userId } });
  res.status(204).send();
}));
