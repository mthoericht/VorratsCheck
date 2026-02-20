import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { toPositiveNumber, isValidUnit } from '../../shared/validation.js';

export const mustHaveRouter = Router();
mustHaveRouter.use(authMiddleware);

mustHaveRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const items = await prisma.mustHaveItem.findMany({ where: { userId } });
    res.json(items.map((i) => ({ id: i.id, name: i.name, category: i.category ?? undefined, minQuantity: i.minQuantity, unit: i.unit ?? undefined })));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

mustHaveRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { name, category, minQuantity, unit } = req.body;
    if (!name) 
    {
      res.status(400).json({ error: 'name erforderlich' });
      return;
    }
    if (unit != null && unit !== '' && !isValidUnit(unit))
    {
      res.status(400).json({ error: 'Ungültige Einheit' });
      return;
    }
    const item = await prisma.mustHaveItem.create({
      data: { userId, name, category: category || null, minQuantity: toPositiveNumber(minQuantity, 1), unit: unit || null },
    });
    res.status(201).json({ id: item.id, name: item.name, category: item.category ?? undefined, minQuantity: item.minQuantity, unit: item.unit ?? undefined });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

async function handleUpdateMustHave(req: Request, res: Response) 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const { name, category, minQuantity, unit } = req.body;
    const existing = await prisma.mustHaveItem.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Eintrag nicht gefunden' });
      return;
    }
    if (unit !== undefined && unit != null && unit !== '' && !isValidUnit(unit))
    {
      res.status(400).json({ error: 'Ungültige Einheit' });
      return;
    }
    const item = await prisma.mustHaveItem.update({
      where: { id, userId },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category: category || null }),
        ...(minQuantity !== undefined && { minQuantity: toPositiveNumber(minQuantity, existing.minQuantity) }),
        ...(unit !== undefined && { unit: unit || null }),
      },
    });
    res.json({ id: item.id, name: item.name, category: item.category ?? undefined, minQuantity: item.minQuantity, unit: item.unit ?? undefined });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
}

mustHaveRouter.patch('/:id', handleUpdateMustHave);
mustHaveRouter.put('/:id', handleUpdateMustHave);

mustHaveRouter.delete('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.mustHaveItem.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Eintrag nicht gefunden' });
      return;
    }
    await prisma.mustHaveItem.delete({ where: { id, userId } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
