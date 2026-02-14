import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const mustHaveRouter = Router();
mustHaveRouter.use(authMiddleware);

mustHaveRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const items = await prisma.mustHaveItem.findMany({ where: { userId } });
    res.json(items.map((i) => ({ id: i.id, name: i.name, category: i.category ?? undefined, minQuantity: i.minQuantity })));
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
    const { name, category, minQuantity } = req.body;
    if (!name) 
    {
      res.status(400).json({ error: 'name erforderlich' });
      return;
    }
    const item = await prisma.mustHaveItem.create({
      data: { userId, name, category: category || null, minQuantity: minQuantity ?? 1 },
    });
    res.status(201).json({ id: item.id, name: item.name, category: item.category ?? undefined, minQuantity: item.minQuantity });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

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
    await prisma.mustHaveItem.delete({ where: { id } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
