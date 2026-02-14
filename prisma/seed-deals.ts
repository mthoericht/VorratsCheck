import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockDeals = [
  { product: 'Vollmilch 3,5%', category: 'Milchprodukte', store: 'REWE', originalPrice: 1.29, discountPrice: 0.99, discount: 23, validUntil: new Date('2026-02-20'), distance: 0.8, inStock: true },
  { product: 'Barilla Spaghetti 500g', category: 'Nudeln', store: 'EDEKA', originalPrice: 1.79, discountPrice: 1.19, discount: 34, validUntil: new Date('2026-02-18'), distance: 1.2, inStock: true },
  { product: 'Bio Eier 10 Stück', category: 'Eier', store: 'ALDI', originalPrice: 3.49, discountPrice: 2.49, discount: 29, validUntil: new Date('2026-02-15'), distance: 0.5, inStock: false },
  { product: 'Lindt Excellence 85%', category: 'Süßwaren', store: 'REWE', originalPrice: 2.99, discountPrice: 1.99, discount: 33, validUntil: new Date('2026-02-22'), distance: 0.8, inStock: true },
  { product: 'Tomatenpassata 500g', category: 'Konserven', store: 'Kaufland', originalPrice: 0.89, discountPrice: 0.59, discount: 34, validUntil: new Date('2026-02-19'), distance: 2.1, inStock: true },
];

async function main() 
{
  const count = await prisma.deal.count();
  if (count === 0) 
  {
    await prisma.deal.createMany({
      data: mockDeals.map((d) => ({ ...d, userId: null })),
    });
    console.log('Seed: Mock-Angebote angelegt.');
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
