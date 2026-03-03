import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importRecipeFromUrl } from '../../../server/lib/recipeImport';

function makeHtml(jsonLd: object, extraHead = ''): string
{
  return `<html><head>${extraHead}<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body></body></html>`;
}

const chefkochJsonLd = {
  '@type': 'Recipe',
  name: 'Spaghetti Bolognese',
  recipeIngredient: ['500 g Hackfleisch', '400 g Spaghetti', '2 Zwiebeln', 'Salz'],
  recipeInstructions: [{
    '@type': 'HowToSection',
    name: 'Zubereitung',
    itemListElement: [
      { '@type': 'HowToStep', text: 'Zwiebeln würfeln.' },
      { '@type': 'HowToStep', text: 'Hackfleisch anbraten.' },
      { '@type': 'HowToStep', text: 'Spaghetti kochen.' },
    ],
  }],
  totalTime: 'PT45M',
  recipeYield: '4 Portionen',
};

const flatStepsJsonLd = {
  '@type': 'Recipe',
  name: 'Rührei',
  recipeIngredient: ['3 Eier', '1 EL Butter', 'Salz'],
  recipeInstructions: [
    { '@type': 'HowToStep', text: 'Eier verquirlen.' },
    { '@type': 'HowToStep', text: 'In Butter braten.' },
  ],
  totalTime: 'PT10M',
  recipeYield: 2,
};

const graphJsonLd = {
  '@graph': [
    { '@type': 'WebPage', name: 'Some Website' },
    {
      '@type': 'Recipe',
      name: 'Pfannkuchen',
      recipeIngredient: ['250 g Mehl', '500 ml Milch'],
      recipeInstructions: [{ '@type': 'HowToStep', text: 'Teig anrühren.' }],
      totalTime: 'PT20M',
      recipeYield: '4',
    },
  ],
};

const stringInstructionsJsonLd = {
  '@type': 'Recipe',
  name: 'Toast',
  recipeIngredient: ['2 Scheiben Toast'],
  recipeInstructions: 'Toast in den Toaster geben.\nWarten bis fertig.',
  totalTime: 'PT5M',
  recipeYield: 1,
};

const fallbackHtml = `<html><head><meta property="og:title" content="Kartoffelsalat"></head><body><h1>Kartoffelsalat</h1></body></html>`;

function mockFetchOk(body: string): void
{
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(body),
  }));
}

describe('importRecipeFromUrl', () =>
{
  beforeEach(() =>
  {
    vi.restoreAllMocks();
  });

  describe('Chefkoch-style nested JSON-LD (HowToSection > HowToStep)', () =>
  {
    it('parses name, ingredients, instructions, cookingTime, servings', async () =>
    {
      mockFetchOk(makeHtml(chefkochJsonLd));
      const result = await importRecipeFromUrl('https://example.com/bolognese');

      expect(result.name).toBe('Spaghetti Bolognese');
      expect(result.instructions).toEqual([
        'Zwiebeln würfeln.',
        'Hackfleisch anbraten.',
        'Spaghetti kochen.',
      ]);
      expect(result.cookingTime).toBe(45);
      expect(result.servings).toBe(4);
      expect(result.sourceUrl).toBe('https://example.com/bolognese');
    });

    it('maps ingredient units correctly (g stays g)', async () =>
    {
      mockFetchOk(makeHtml(chefkochJsonLd));
      const result = await importRecipeFromUrl('https://example.com/bolognese');

      expect(result.ingredients).toContainEqual({ name: 'Hackfleisch', quantity: 500, unit: 'g' });
      expect(result.ingredients).toContainEqual({ name: 'Spaghetti', quantity: 400, unit: 'g' });
    });

    it('handles ingredients without a recognized unit (quantity only)', async () =>
    {
      mockFetchOk(makeHtml(chefkochJsonLd));
      const result = await importRecipeFromUrl('https://example.com/bolognese');

      expect(result.ingredients).toContainEqual({ name: 'Zwiebeln', quantity: 2 });
    });

    it('handles ingredients without quantity ("Salz")', async () =>
    {
      mockFetchOk(makeHtml(chefkochJsonLd));
      const result = await importRecipeFromUrl('https://example.com/bolognese');

      expect(result.ingredients).toContainEqual({ name: 'Salz' });
    });
  });

  describe('flat HowToStep[] instructions', () =>
  {
    it('parses flat instructions array', async () =>
    {
      mockFetchOk(makeHtml(flatStepsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/ruehrei');

      expect(result.instructions).toEqual([
        'Eier verquirlen.',
        'In Butter braten.',
      ]);
    });

    it('maps EL unit correctly', async () =>
    {
      mockFetchOk(makeHtml(flatStepsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/ruehrei');

      expect(result.ingredients).toContainEqual({ name: 'Butter', quantity: 1, unit: 'EL' });
    });

    it('handles numeric recipeYield', async () =>
    {
      mockFetchOk(makeHtml(flatStepsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/ruehrei');

      expect(result.servings).toBe(2);
    });
  });

  describe('@graph-wrapped Recipe', () =>
  {
    it('finds Recipe inside @graph array', async () =>
    {
      mockFetchOk(makeHtml(graphJsonLd));
      const result = await importRecipeFromUrl('https://example.com/pfannkuchen');

      expect(result.name).toBe('Pfannkuchen');
      expect(result.ingredients).toContainEqual({ name: 'Mehl', quantity: 250, unit: 'g' });
      expect(result.ingredients).toContainEqual({ name: 'Milch', quantity: 500, unit: 'ml' });
      expect(result.instructions).toEqual(['Teig anrühren.']);
      expect(result.cookingTime).toBe(20);
      expect(result.servings).toBe(4);
    });
  });

  describe('string instructions', () =>
  {
    it('splits string instructions by newline', async () =>
    {
      mockFetchOk(makeHtml(stringInstructionsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/toast');

      expect(result.instructions).toEqual([
        'Toast in den Toaster geben.',
        'Warten bis fertig.',
      ]);
    });

    it('handles numeric recipeYield of 1', async () =>
    {
      mockFetchOk(makeHtml(stringInstructionsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/toast');

      expect(result.servings).toBe(1);
    });

    it('maps "Scheiben" to stk', async () =>
    {
      mockFetchOk(makeHtml(stringInstructionsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/toast');

      expect(result.ingredients).toContainEqual({ name: 'Toast', quantity: 2, unit: 'stk' });
    });
  });

  describe('ISO duration parsing', () =>
  {
    it('parses PT45M to 45 minutes', async () =>
    {
      mockFetchOk(makeHtml(chefkochJsonLd));
      const result = await importRecipeFromUrl('https://example.com/bolognese');

      expect(result.cookingTime).toBe(45);
    });

    it('parses PT1H30M to 90 minutes', async () =>
    {
      const jsonLd = { ...flatStepsJsonLd, totalTime: 'PT1H30M' };
      mockFetchOk(makeHtml(jsonLd));
      const result = await importRecipeFromUrl('https://example.com/recipe');

      expect(result.cookingTime).toBe(90);
    });

    it('parses PT10M to 10 minutes', async () =>
    {
      mockFetchOk(makeHtml(flatStepsJsonLd));
      const result = await importRecipeFromUrl('https://example.com/ruehrei');

      expect(result.cookingTime).toBe(10);
    });
  });

  describe('fallback HTML parsing (no JSON-LD)', () =>
  {
    it('extracts name from og:title', async () =>
    {
      mockFetchOk(fallbackHtml);
      const result = await importRecipeFromUrl('https://example.com/kartoffelsalat');

      expect(result.name).toBe('Kartoffelsalat');
    });

    it('falls back to h1 when no og:title', async () =>
    {
      const html = '<html><head></head><body><h1>Gulasch</h1></body></html>';
      mockFetchOk(html);
      const result = await importRecipeFromUrl('https://example.com/gulasch');

      expect(result.name).toBe('Gulasch');
    });

    it('returns default values for missing fields', async () =>
    {
      mockFetchOk(fallbackHtml);
      const result = await importRecipeFromUrl('https://example.com/kartoffelsalat');

      expect(result.cookingTime).toBe(30);
      expect(result.difficulty).toBe('medium');
      expect(result.servings).toBe(4);
      expect(result.instructions).toEqual([]);
    });

    it('passes sourceUrl through', async () =>
    {
      mockFetchOk(fallbackHtml);
      const result = await importRecipeFromUrl('https://example.com/kartoffelsalat');

      expect(result.sourceUrl).toBe('https://example.com/kartoffelsalat');
    });
  });

  describe('fetch failure', () =>
  {
    it('throws error on non-200 response', async () =>
    {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found'),
      }));

      await expect(importRecipeFromUrl('https://example.com/missing'))
        .rejects.toThrow('Failed to fetch URL: 404');
    });
  });

  describe('unit mapping', () =>
  {
    it('maps ml correctly', async () =>
    {
      mockFetchOk(makeHtml(graphJsonLd));
      const result = await importRecipeFromUrl('https://example.com/pfannkuchen');

      const milch = result.ingredients.find(i => i.name === 'Milch');
      expect(milch?.unit).toBe('ml');
    });

    it('maps unknown units to stk', async () =>
    {
      const jsonLd = {
        '@type': 'Recipe',
        name: 'Test',
        recipeIngredient: ['3 Scheiben Brot'],
        recipeInstructions: [],
        totalTime: 'PT10M',
        recipeYield: 1,
      };
      mockFetchOk(makeHtml(jsonLd));
      const result = await importRecipeFromUrl('https://example.com/test');

      expect(result.ingredients).toContainEqual({ name: 'Brot', quantity: 3, unit: 'stk' });
    });
  });

  describe('sourceUrl', () =>
  {
    it('is passed through from the input URL', async () =>
    {
      mockFetchOk(makeHtml(flatStepsJsonLd));
      const result = await importRecipeFromUrl('https://chefkoch.de/rezepte/123');

      expect(result.sourceUrl).toBe('https://chefkoch.de/rezepte/123');
    });
  });
});
