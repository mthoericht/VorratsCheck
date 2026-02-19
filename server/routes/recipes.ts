import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

export const recipesRouter = Router();
recipesRouter.use(authMiddleware);

type RecipeIngredient = { name: string; quantity?: number; unit?: string };

function parseIngredientsJson(json: string): RecipeIngredient[] 
{
  try 
  {
    const raw = JSON.parse(json);
    if (!Array.isArray(raw)) return [];
    return raw.map((item: unknown) => 
    {
      if (typeof item === 'object' && item !== null && 'name' in item) 
      {
        const o = item as { name: string; quantity?: number; unit?: string };
        return { name: o.name, quantity: o.quantity, unit: o.unit };
      }
      if (typeof item === 'string') 
      {
        const trimmed = item.trim();
        const startMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.+)$/);
        if (startMatch) 
        {
          return {
            name: startMatch[3].trim(),
            quantity: parseFloat(startMatch[1].replace(',', '.')),
            unit: startMatch[2].trim(),
          };
        }
        const endMatch = trimmed.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s+(\S+)$/);
        if (endMatch) 
        {
          return {
            name: endMatch[1].trim(),
            quantity: parseFloat(endMatch[2].replace(',', '.')),
            unit: endMatch[3].trim(),
          };
        }
        return { name: trimmed };
      }
      return { name: String(item) };
    });
  }
  catch 
  {
    return [];
  }
}

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
    ingredients: parseIngredientsJson(recipe.ingredients),
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
    const normalizedIngredients = ingredients.map((item: unknown) => 
    {
      if (typeof item === 'object' && item !== null && 'name' in item) 
      {
        const o = item as { name: string; quantity?: number; unit?: string };
        return { name: o.name, quantity: o.quantity, unit: o.unit };
      }
      if (typeof item === 'string') 
      {
        const t = item.trim();
        const m1 = t.match(/^(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.+)$/);
        if (m1) return { name: m1[3].trim(), quantity: parseFloat(m1[1].replace(',', '.')), unit: m1[2].trim() };
        const m2 = t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s+(\S+)$/);
        if (m2) return { name: m2[1].trim(), quantity: parseFloat(m2[2].replace(',', '.')), unit: m2[3].trim() };
        return { name: t };
      }
      return { name: String(item) };
    });
    const recipe = await prisma.recipe.create({
      data: {
        userId,
        name,
        ingredients: JSON.stringify(normalizedIngredients),
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
    const normalizedIngredients =
      ingredients != null && Array.isArray(ingredients)
        ? ingredients.map((item: unknown) => 
        {
          if (typeof item === 'object' && item !== null && 'name' in item) 
          {
            const o = item as { name: string; quantity?: number; unit?: string };
            return { name: o.name, quantity: o.quantity, unit: o.unit };
          }
          if (typeof item === 'string') 
          {
            const t = item.trim();
            const m1 = t.match(/^(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.+)$/);
            if (m1) return { name: m1[3].trim(), quantity: parseFloat(m1[1].replace(',', '.')), unit: m1[2].trim() };
            const m2 = t.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s+(\S+)$/);
            if (m2) return { name: m2[1].trim(), quantity: parseFloat(m2[2].replace(',', '.')), unit: m2[3].trim() };
            return { name: t };
          }
          return { name: String(item) };
        })
        : undefined;
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(normalizedIngredients !== undefined && { ingredients: JSON.stringify(normalizedIngredients) }),
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
