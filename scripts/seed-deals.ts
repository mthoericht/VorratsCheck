import 'dotenv/config';
import './resolve-db-url.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockDeals = [
  { product: 'Vollmilch 3,5%', name: 'Milch', store: 'REWE', originalPrice: 1.29, discountPrice: 0.99, discount: 23, validUntil: new Date('2026-02-20'), distance: 0.8, inStock: true, userId: null },
  { product: 'Barilla Spaghetti 500g', name: 'Nudeln', store: 'EDEKA', originalPrice: 1.79, discountPrice: 1.19, discount: 34, validUntil: new Date('2026-02-18'), distance: 1.2, inStock: true, userId: null },
  { product: 'Bio Eier 10 Stück', name: 'Eier', store: 'ALDI', originalPrice: 3.49, discountPrice: 2.49, discount: 29, validUntil: new Date('2026-02-15'), distance: 0.5, inStock: false, userId: null },
  { product: 'Lindt Excellence 85%', name: 'Schokolade', store: 'REWE', originalPrice: 2.99, discountPrice: 1.99, discount: 33, validUntil: new Date('2026-02-22'), distance: 0.8, inStock: true, userId: null },
  { product: 'Tomatenpassata 500g', name: 'Dosentomaten', store: 'Kaufland', originalPrice: 0.89, discountPrice: 0.59, discount: 34, validUntil: new Date('2026-02-19'), distance: 2.1, inStock: true, userId: null },
];

async function main() 
{
  const deleted = await prisma.deal.deleteMany({});
  await prisma.deal.createMany({
    data: mockDeals,
  });
  console.log(`Seed: Deals auf ${mockDeals.length} Mock-Angebote zurückgesetzt (${deleted.count} alte gelöscht).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => 
  {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
