import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Common category names for household/food storage (German). */
const DEFAULT_CATEGORY_NAMES = [
  'Backwaren',
  'Eier',
  'Fisch',
  'Fleisch & Wurst',
  'Gemüse',
  'Getränke',
  'Gewürze & Öle',
  'Konserven',
  'Milchprodukte',
  'Nudeln & Pasta',
  'Obst',
  'Reis & Getreide',
  'Snacks',
  'Sonstiges',
];

async function main() 
{
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) 
  {
    console.log('Seed categories: No users found. Create a user first (e.g. sign up), then run this seed.');
    return;
  }

  let created = 0;
  for (const user of users) 
  {
    const existing = await prisma.category.findMany({
      where: { userId: user.id },
      select: { name: true },
    });
    const existingNames = new Set(existing.map((c) => c.name));
    const toCreate = DEFAULT_CATEGORY_NAMES.filter((name) => !existingNames.has(name));

    if (toCreate.length > 0) 
    {
      await prisma.category.createMany({
        data: toCreate.map((name) => ({ userId: user.id, name })),
      });
      created += toCreate.length;
    }
  }

  if (created > 0) 
  {
    console.log(`Seed categories: Created ${created} category entries for ${users.length} user(s).`);
  }
  else 
  {
    console.log('Seed categories: All users already have the default categories.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => 
  {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
