import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const recipesRouter = Router();
recipesRouter.use(authMiddleware);

function mapRecipe(recipe: {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
}) 
{
  return {
    id: recipe.id,
    name: recipe.name,
    ingredients: JSON.parse(recipe.ingredients) as string[],
    instructions: JSON.parse(recipe.instructions) as string[],
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
    servings: recipe.servings,
  };
}

recipesRouter.get('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const recipes = await prisma.recipe.findMany({ where: { userId } });
    res.json(recipes.map(mapRecipe));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

recipesRouter.post('/', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { name, ingredients, instructions, cookingTime, difficulty, servings } = req.body;
    if (!name || !Array.isArray(ingredients) || !Array.isArray(instructions) || cookingTime == null || !difficulty || servings == null) 
    {
      res.status(400).json({ error: 'name, ingredients, instructions, cookingTime, difficulty, servings erforderlich' });
      return;
    }
    const recipe = await prisma.recipe.create({
      data: {
        userId,
        name,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        cookingTime: Number(cookingTime),
        difficulty,
        servings: Number(servings),
      },
    });
    res.status(201).json(mapRecipe(recipe));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

recipesRouter.patch('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.recipe.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Rezept nicht gefunden' });
      return;
    }
    const { name, ingredients, instructions, cookingTime, difficulty, servings } = req.body;
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(ingredients != null && { ingredients: JSON.stringify(ingredients) }),
        ...(instructions != null && { instructions: JSON.stringify(instructions) }),
        ...(cookingTime != null && { cookingTime: Number(cookingTime) }),
        ...(difficulty != null && { difficulty }),
        ...(servings != null && { servings: Number(servings) }),
      },
    });
    res.json(mapRecipe(recipe));
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

recipesRouter.delete('/:id', async (req: Request, res: Response) => 
{
  try 
  {
    const userId = (req as Request & { user?: { userId: string } }).user!.userId;
    const { id } = req.params;
    const existing = await prisma.recipe.findFirst({ where: { id, userId } });
    if (!existing) 
    {
      res.status(404).json({ error: 'Rezept nicht gefunden' });
      return;
    }
    await prisma.recipe.delete({ where: { id } });
    res.status(204).send();
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
