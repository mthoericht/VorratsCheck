import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { toPositiveNumber, isValidDate, isValidUnit } from '../../shared/validation.js';
import { getUserId, toISODate, asyncHandler } from '../lib/routeHelpers.js';

export const inventoryRouter = Router();
inventoryRouter.use(authMiddleware);

inventoryRouter.get('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);

  //test-error
  //res.status(400).json({ error: 'serverErrors.invalidUnit' });
  //return;

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
      expiryDate: i.expiryDate ? toISODate(i.expiryDate) : undefined,
      location: i.location ?? undefined,
      addedDate: toISODate(i.addedDate),
    }))
  );
}));

inventoryRouter.post('/', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { name, category, brand, barcode, quantity, unit, expiryDate, location } = req.body;
  if (!name || !category) 
  {
    res.status(400).json({ error: 'serverErrors.nameCategoryRequired' });
    return;
  }
  const quantityNum = quantity != null && quantity !== '' ? toPositiveNumber(quantity, 1) : 1;
  const unitVal = unit || 'stk';
  if (!isValidUnit(unitVal))
  {
    res.status(400).json({ error: 'serverErrors.invalidUnit' });
    return;
  }
  const item = await prisma.inventoryItem.create({
    data: {
      userId,
      name,
      category,
      brand: brand || null,
      barcode: barcode || null,
      quantity: quantityNum,
      unit: unitVal,
      expiryDate: expiryDate && isValidDate(expiryDate) ? new Date(expiryDate) : null,
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
    expiryDate: item.expiryDate ? toISODate(item.expiryDate) : undefined,
    location: item.location ?? undefined,
    addedDate: toISODate(item.addedDate),
  });
}));

inventoryRouter.patch('/:id', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { id } = req.params;
  const existing = await prisma.inventoryItem.findFirst({ where: { id, userId } });
  if (!existing) 
  {
    res.status(404).json({ error: 'serverErrors.entryNotFound' });
    return;
  }
  const { name, category, brand, barcode, quantity, unit, expiryDate, location } = req.body;
  if (unit != null && unit !== '' && !isValidUnit(unit))
  {
    res.status(400).json({ error: 'serverErrors.invalidUnit' });
    return;
  }
  const item = await prisma.inventoryItem.update({
    where: { id, userId },
    data: {
      ...(name != null && { name }),
      ...(category != null && { category }),
      ...(brand !== undefined && { brand: brand || null }),
      ...(barcode !== undefined && { barcode: barcode || null }),
      ...(quantity != null && { quantity: toPositiveNumber(quantity, existing.quantity) }),
      ...(unit != null && { unit: unit || 'stk' }),
      ...(expiryDate !== undefined && { expiryDate: expiryDate && isValidDate(expiryDate) ? new Date(expiryDate) : null }),
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
    expiryDate: item.expiryDate ? toISODate(item.expiryDate) : undefined,
    location: item.location ?? undefined,
    addedDate: toISODate(item.addedDate),
  });
}));

inventoryRouter.delete('/:id', asyncHandler(async (req, res) => 
{
  const userId = getUserId(req);
  const { id } = req.params;
  const existing = await prisma.inventoryItem.findFirst({ where: { id, userId } });
  if (!existing) 
  {
    res.status(404).json({ error: 'serverErrors.entryNotFound' });
    return;
  }
  await prisma.inventoryItem.delete({ where: { id, userId } });
  res.status(204).send();
}));
