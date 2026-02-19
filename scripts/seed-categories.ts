import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Common category names for household/food storage (German). */
const DEFAULT_CATEGORY_NAMES = [
  'Backwaren',
  'Dosentomaten',
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
  'Schokolade',
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

  let totalDeleted = 0;
  let totalCreated = 0;
  for (const user of users) 
  {
    const deleted = await prisma.category.deleteMany({ where: { userId: user.id } });
    totalDeleted += deleted.count;
    await prisma.category.createMany({
      data: DEFAULT_CATEGORY_NAMES.map((name) => ({ userId: user.id, name })),
    });
    totalCreated += DEFAULT_CATEGORY_NAMES.length;
  }

  console.log(`Seed categories: Pro User auf ${DEFAULT_CATEGORY_NAMES.length} Kategorien zurückgesetzt (${users.length} User(s), ${totalDeleted} alte gelöscht).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => 
  {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
