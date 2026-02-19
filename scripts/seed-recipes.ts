import 'dotenv/config';
import './resolve-db-url.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Zutat: name + optionale Menge/Einheit (für Vorrats-Matching). */
type SeedIngredient = { name: string; quantity?: number; unit?: string };

/**
 * Zählbare Zutaten (z. B. Möhre, Zwiebel, Tomaten, Ei) immer mit quantity und unit: 'Stück' angeben,
 * damit das Rezept-Matching mit dem Vorrat funktioniert.
 */
/** Common recipes to seed per user. Ingredients as array of { name, quantity?, unit? }. */
const DEFAULT_RECIPES = [
  {
    name: 'Spaghetti Aglio e Olio',
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Knoblauch', quantity: 4, unit: 'Zehen' },
      { name: 'Olivenöl', quantity: 6, unit: 'EL' },
      { name: 'Petersilie' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
      { name: 'Chiliflocken (optional)' },
    ] as SeedIngredient[],
    instructions: [
      'Nudeln in Salzwasser bissfest kochen.',
      'Knoblauch in dünne Scheiben schneiden.',
      'Olivenöl in einer Pfanne erhitzen, Knoblauch und Chiliflocken kurz anbraten (nicht braun werden lassen).',
      'Nudeln abgießen, etwas Nudelwasser auffangen und zu den Nudeln in die Pfanne geben, alles vermengen.',
      'Mit Salz, Pfeffer und Petersilie abschmecken.',
    ],
    cookingTime: 20,
    difficulty: 'easy' as const,
    servings: 4,
  },
  {
    name: 'Rührei',
    ingredients: [
      { name: 'Eier', quantity: 4, unit: 'Stück' },
      { name: 'Butter', quantity: 20, unit: 'g' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
      { name: 'Milch', quantity: 2, unit: 'EL' },
    ] as SeedIngredient[],
    instructions: [
      'Eier in einer Schüssel verquirlen, mit Salz und Pfeffer würzen, optional Milch zugeben.',
      'Butter in einer Pfanne zerlassen, Eiermasse hineingeben.',
      'Bei mittlerer Hitze unter vorsichtigem Rühren stocken lassen, bis die gewünschte Konsistenz erreicht ist.',
    ],
    cookingTime: 10,
    difficulty: 'easy' as const,
    servings: 2,
  },
  {
    name: 'Tomaten-Mozzarella-Salat',
    ingredients: [
      { name: 'Tomaten', quantity: 4, unit: 'Stück' },
      { name: 'Mozzarella', quantity: 2, unit: 'Kugeln' },
      { name: 'Basilikum' },
      { name: 'Olivenöl' },
      { name: 'Balsamico' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
    ] as SeedIngredient[],
    instructions: [
      'Tomaten und Mozzarella in Scheiben schneiden und abwechselnd auf einem Teller anrichten.',
      'Mit Basilikumblättern, Olivenöl und Balsamico beträufeln.',
      'Mit Salz und Pfeffer würzen.',
    ],
    cookingTime: 15,
    difficulty: 'easy' as const,
    servings: 2,
  },
  {
    name: 'Gemüsepfanne',
    ingredients: [
      { name: 'Zucchini', quantity: 1, unit: 'Stück' },
      { name: 'Paprika', quantity: 2, unit: 'Stück' },
      { name: 'Zwiebel', quantity: 1, unit: 'Stück' },
      { name: 'Knoblauch', quantity: 2, unit: 'Zehen' },
      { name: 'Olivenöl' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
      { name: 'Paprikapulver' },
    ] as SeedIngredient[],
    instructions: [
      'Gemüse waschen und in mundgerechte Stücke schneiden.',
      'Öl in einer großen Pfanne erhitzen, Zwiebel und Knoblauch anbraten.',
      'Paprika und Zucchini zugeben und unter Rühren braten.',
      'Mit Gewürzen abschmecken und servieren.',
    ],
    cookingTime: 25,
    difficulty: 'easy' as const,
    servings: 2,
  },
  {
    name: 'Reis mit Gemüse',
    ingredients: [
      { name: 'Reis', quantity: 200, unit: 'g' },
      { name: 'Brokkoli', quantity: 200, unit: 'g' },
      { name: 'Möhre', quantity: 1, unit: 'Stück' },
      { name: 'Sojasoße' },
      { name: 'Öl' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
    ] as SeedIngredient[],
    instructions: [
      'Reis nach Packungsanweisung kochen.',
      'Brokkoli und Möhre in kleine Stücke schneiden und in wenig Öl anbraten.',
      'Reis unterrühren, mit Sojasoße, Salz und Pfeffer abschmecken.',
    ],
    cookingTime: 30,
    difficulty: 'easy' as const,
    servings: 2,
  },
  {
    name: 'Pancakes',
    ingredients: [
      { name: 'Mehl', quantity: 200, unit: 'g' },
      { name: 'Milch', quantity: 300, unit: 'ml' },
      { name: 'Ei', quantity: 1, unit: 'Stück' },
      { name: 'Backpulver', quantity: 1, unit: 'TL' },
      { name: 'Salz', quantity: 1, unit: 'Prise' },
      { name: 'Butter zum Braten' },
    ] as SeedIngredient[],
    instructions: [
      'Mehl, Backpulver und Salz mischen. Milch und Ei verquirlen und unter die Mehlmischung rühren.',
      'Pfanne erhitzen, etwas Butter zugeben. Portionsweise Teig in die Pfanne geben und von beiden Seiten goldbraun backen.',
    ],
    cookingTime: 25,
    difficulty: 'easy' as const,
    servings: 2,
  },
  {
    name: 'Bolognese (einfach)',
    ingredients: [
      { name: 'Hackfleisch', quantity: 400, unit: 'g' },
      { name: 'Zwiebel', quantity: 1, unit: 'Stück' },
      { name: 'Knoblauch', quantity: 2, unit: 'Zehen' },
      { name: 'Tomatenpassata', quantity: 500, unit: 'g' },
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Öl' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
      { name: 'Oregano' },
      { name: 'Basilikum' },
    ] as SeedIngredient[],
    instructions: [
      'Zwiebel und Knoblauch fein hacken, in Öl anbraten. Hackfleisch zugeben und krümelig braten.',
      'Passata zugeben, mit Gewürzen abschmecken und 15–20 Minuten köcheln lassen.',
      'Spaghetti kochen, abgießen und mit der Sauce servieren.',
    ],
    cookingTime: 45,
    difficulty: 'medium' as const,
    servings: 4,
  },
  {
    name: 'Kräuterquark',
    ingredients: [
      { name: 'Magerquark', quantity: 500, unit: 'g' },
      { name: 'Schnittlauch' },
      { name: 'Petersilie' },
      { name: 'Dill' },
      { name: 'Salz' },
      { name: 'Pfeffer' },
      { name: 'Milch' },
    ] as SeedIngredient[],
    instructions: [
      'Kräuter waschen, trocken tupfen und fein hacken.',
      'Quark mit etwas Milch glatt rühren, Kräuter unterheben.',
      'Mit Salz und Pfeffer abschmecken.',
    ],
    cookingTime: 10,
    difficulty: 'easy' as const,
    servings: 4,
  },
];

async function main() 
{
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) 
  {
    console.log('Seed recipes: No users found. Create a user first (e.g. sign up), then run this seed.');
    return;
  }

  let totalDeleted = 0;
  let totalCreated = 0;
  for (const user of users) 
  {
    const deleted = await prisma.recipe.deleteMany({ where: { userId: user.id } });
    totalDeleted += deleted.count;
    for (const recipe of DEFAULT_RECIPES) 
    {
      await prisma.recipe.create({
        data: {
          userId: user.id,
          name: recipe.name,
          ingredients: JSON.stringify(recipe.ingredients),
          instructions: JSON.stringify(recipe.instructions),
          cookingTime: recipe.cookingTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
        },
      });
      totalCreated++;
    }
  }

  console.log(`Seed recipes: Pro User auf ${DEFAULT_RECIPES.length} Rezepte zurückgesetzt (${users.length} User(s), ${totalDeleted} alte gelöscht, ${totalCreated} neu angelegt).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => 
  {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
