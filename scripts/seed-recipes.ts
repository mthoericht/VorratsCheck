import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Common recipes to seed per user. Ingredients/instructions as JSON arrays. */
const DEFAULT_RECIPES = [
  {
    name: 'Spaghetti Aglio e Olio',
    ingredients: ['Spaghetti 400 g', 'Knoblauch 4 Zehen', 'Olivenöl 6 EL', 'Petersilie', 'Salz', 'Pfeffer', 'Chiliflocken (optional)'],
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
    ingredients: ['Eier 4', 'Butter 20 g', 'Salz', 'Pfeffer', 'Milch 2 EL (optional)'],
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
    ingredients: ['Tomaten 4', 'Mozzarella 2 Kugeln', 'Basilikum', 'Olivenöl', 'Balsamico', 'Salz', 'Pfeffer'],
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
    ingredients: ['Zucchini 1', 'Paprika 2', 'Zwiebel 1', 'Knoblauch 2 Zehen', 'Olivenöl', 'Salz', 'Pfeffer', 'Paprikapulver'],
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
    ingredients: ['Reis 200 g', 'Brokkoli 200 g', 'Möhre 1', 'Sojasoße', 'Öl', 'Salz', 'Pfeffer'],
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
    ingredients: ['Mehl 200 g', 'Milch 300 ml', 'Ei 1', 'Backpulver 1 TL', 'Salz 1 Prise', 'Butter zum Braten'],
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
    ingredients: ['Hackfleisch 400 g', 'Zwiebel 1', 'Knoblauch 2 Zehen', 'Tomatenpassata 500 g', 'Spaghetti 400 g', 'Öl', 'Salz', 'Pfeffer', 'Oregano', 'Basilikum'],
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
    ingredients: ['Magerquark 500 g', 'Schnittlauch', 'Petersilie', 'Dill', 'Salz', 'Pfeffer', 'etwas Milch'],
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

  let created = 0;
  for (const user of users) 
  {
    const existingNames = new Set(
      (await prisma.recipe.findMany({ where: { userId: user.id }, select: { name: true } })).map((r) => r.name)
    );
    const toCreate = DEFAULT_RECIPES.filter((r) => !existingNames.has(r.name));

    for (const recipe of toCreate) 
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
      created++;
    }
  }

  if (created > 0) 
  {
    console.log(`Seed recipes: Created ${created} recipe(s) for ${users.length} user(s).`);
  }
  else 
  {
    console.log('Seed recipes: All users already have the default recipes.');
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
