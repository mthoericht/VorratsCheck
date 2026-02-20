/**
 * One-off script: which units from UNITS are actually used in the DB?
 * Run: npx tsx scripts/check-units-usage.ts
 */
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { UNITS } from '../shared/units.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:./')) 
{
  process.env.DATABASE_URL = `file:${path.join(projectRoot, 'data', 'dev.db')}`;
}

const prisma = new PrismaClient();

const definedUnits = new Set(UNITS.map((u) => u.value));

const usedUnits = new Set<string>();

async function main() 
{
  const inventory = await prisma.inventoryItem.findMany({ select: { unit: true } });
  inventory.forEach((r) => usedUnits.add(r.unit));

  const mustHave = await prisma.mustHaveItem.findMany({ select: { unit: true } });
  mustHave.forEach((r) => 
  {
    if (r.unit) usedUnits.add(r.unit);
  });

  const recipes = await prisma.recipe.findMany({ select: { ingredients: true } });
  for (const r of recipes) 
  {
    try 
    {
      const ingredients = JSON.parse(r.ingredients) as Array<{ unit?: string }>;
      ingredients.forEach((i) => 
      {
        if (i.unit) usedUnits.add(i.unit);
      });
    }
    catch 
    {
      // ignore invalid JSON
    }
  }

  const unused = [...definedUnits].filter((u) => !usedUnits.has(u)).sort();
  const used = [...usedUnits].sort();

  console.log('In DB verwendete Einheiten:', used.length ? used.join(', ') : '(keine)');
  console.log('');
  console.log('In UNITS definiert, aber in der DB nirgends verwendet (können entfernt werden):');
  console.log(unused.length ? unused.join(', ') : '(keine)');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => 
  {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
