import * as cheerio from 'cheerio';

/** A single parsed ingredient with optional quantity and unit. */
interface ImportedIngredient {
  name: string;
  quantity?: number;
  unit?: string;
}

/** Result of importing a recipe from an external URL. */
export interface ImportedRecipe {
  name: string;
  ingredients: ImportedIngredient[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  sourceUrl: string;
  /** True when data was extracted from JSON-LD; false when only HTML fallback was used. */
  fromJsonLd?: boolean;
}

/** Maps common German/English unit strings (recipe sites) to app unit values (g, kg, ml, l, EL, TL, pr, stk). */
const UNIT_IMPORT_MAP: Record<string, string> = {
  g: 'g', gramm: 'g', gram: 'g', grams: 'g',
  kg: 'kg', kilogramm: 'kg', kilogram: 'kg',
  ml: 'ml', milliliter: 'ml',
  l: 'l', liter: 'l', litre: 'l',
  el: 'EL', esslöffel: 'EL', tbsp: 'EL', tablespoon: 'EL',
  tl: 'TL', teelöffel: 'TL', tsp: 'TL', teaspoon: 'TL',
  prise: 'pr', prisen: 'pr', pinch: 'pr',
  stück: 'stk', stk: 'stk', stücke: 'stk', piece: 'stk', pieces: 'stk',
  scheibe: 'stk', scheiben: 'stk',
  zehe: 'stk', zehen: 'stk',
  bund: 'stk', becher: 'stk', dose: 'stk', dosen: 'stk',
  packung: 'stk', pkg: 'stk', päckchen: 'stk', pck: 'stk',
  tasse: 'stk', tassen: 'stk', cup: 'stk', cups: 'stk',
};

/** Maps a raw unit string from imported recipes to an app unit value. Falls back to 'stk'. */
function mapUnit(raw: string): string 
{
  const lower = raw.toLowerCase().trim();
  return UNIT_IMPORT_MAP[lower] ?? 'stk';
}

/** Returns true if the raw string is a known key in UNIT_IMPORT_MAP (used to detect unit vs. part of name). */
function hasImportUnit(raw: string): boolean 
{
  return raw.toLowerCase().trim() in UNIT_IMPORT_MAP;
}

/** Parses a numeric string that may contain unicode fractions (e.g. "1 ½", "¾", "2,5"). */
function parseFraction(str: string): number
{
  const fractions: Record<string, number> = {
    '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75,
    '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
    '⅙': 1 / 6, '⅚': 5 / 6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
  };

  let result = 0;
  let remaining = str.trim();

  // Check for "1 ½" pattern
  const mixedMatch = remaining.match(/^(\d+)\s+([^\d\s])/);
  if (mixedMatch)
  {
    result = parseInt(mixedMatch[1], 10);
    remaining = remaining.slice(mixedMatch[1].length).trim();
  }

  // Check for unicode fractions
  for (const [frac, val] of Object.entries(fractions))
  {
    if (remaining.includes(frac))
    {
      result += val;
      return result;
    }
  }

  // Regular number with comma or dot
  const numMatch = remaining.match(/^(\d+(?:[.,]\d+)?)/);
  if (numMatch)
  {
    result += parseFloat(numMatch[1].replace(',', '.'));
  }

  return result;
}

/** Parses a free-text ingredient string like "200 g Mehl" into name, quantity, and unit. */
function parseIngredientString(text: string): ImportedIngredient
{
  const trimmed = text.trim();
  if (!trimmed) return { name: trimmed };
  // Match: (quantity) + space + optional (unit + space) + (rest = name).
  // Group 1 (quantity): digits with optional decimal [.,] or optional unicode fraction (½, ¾, …), or standalone fraction.
  // Group 2 (optional unit): non-whitespace token before the rest (only used if it's a known unit).
  // Group 3: ingredient name (remainder).
  const match = trimmed.match(/^(\d+(?:[.,]\d+)?(?:\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])?|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])\s+(?:(\S+)\s+)?(.+)$/);

  if (match)
  {
    const quantity = parseFraction(match[1]);
    const possibleUnit = match[2];
    const rest = match[3].trim();

    // If we found a known unit, use it; otherwise, the unit was part of the name.
    if (possibleUnit && hasImportUnit(possibleUnit))
    {
      return {
        name: rest,
        quantity: quantity || undefined,
        unit: mapUnit(possibleUnit),
      };
    }
    // No recognized unit — the "unit" was part of the name
    const fullName = possibleUnit ? `${possibleUnit} ${rest}` : rest;
    return {
      name: fullName,
      quantity: quantity || undefined,
    };
  }

  return { name: trimmed };
}

/** Extracts the first Schema.org Recipe object from JSON-LD script tags in HTML. Supports `@graph` wrappers. */
function extractJsonLd(html: string): Record<string, unknown> | null
{
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (const el of scripts.toArray())
  {
    try
    {
      const data = JSON.parse($(el).html() || '');

      // Could be a single object or an array
      const items = Array.isArray(data) ? data : [data];
      for (const item of items)
      {
        if (item['@type'] === 'Recipe') return item;
        // Some sites wrap in @graph
        if (item['@graph'] && Array.isArray(item['@graph']))
        {
          const recipe = item['@graph'].find((g: Record<string, unknown>) => g['@type'] === 'Recipe');
          if (recipe) return recipe;
        }
      }
    }
    catch { /* skip invalid JSON */ }
  }
  return null;
}

/** Parses an ISO 8601 duration (e.g. "PT45M", "PT1H30M") into total minutes. */
function parseIsoDuration(iso: string): number
{  
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

/** Maps a raw difficulty string (German/English) to 'easy', 'medium', or 'hard'. Defaults to 'medium'. */
function mapDifficulty(raw: string | undefined): 'easy' | 'medium' | 'hard'
{
  if (!raw) return 'medium';
  const lower = raw.toLowerCase();
  if (lower.includes('simpel') || lower.includes('einfach') || lower.includes('easy') || lower.includes('simple'))
    return 'easy';
  if (lower.includes('schwer') || lower.includes('hard') || lower.includes('difficult') || lower.includes('pfiffig'))
    return 'hard';
  return 'medium';
}

/** Extracts a servings count from various formats (number, string like "4 Portionen", or `{ value }` object). Defaults to 4. */
function parseServings(raw: unknown): number
{
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string')
  {
    const match = raw.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 4;
  }
  if (typeof raw === 'object' && raw !== null && 'value' in raw)
  {
    return parseServings((raw as { value: unknown }).value);
  }
  return 4;
}

/** Parses recipe instructions from JSON-LD. Handles plain strings, flat HowToStep arrays, and nested HowToSection → itemListElement structures. */
function parseInstructions(raw: unknown): string[]
{
  if (typeof raw === 'string')
    // Split by newline and trim whitespace, then remove empty strings
    return raw.split('\n').map(s => s.trim()).filter(Boolean); 

  if (Array.isArray(raw))
  {
    return raw.flatMap((item): string[] =>
    {
      if (typeof item === 'string') return [item.trim()];
      if (typeof item !== 'object' || item === null) return [];

      // HowToSection (Chefkoch.de): contains itemListElement with HowToStep[]
      if ('itemListElement' in item && Array.isArray(item.itemListElement))
        return parseInstructions(item.itemListElement);

      // HowToStep: has text field
      if ('text' in item) return [String(item.text).trim()];

      return [];
    }).filter(Boolean); // Remove empty strings
  }

  return [];
}

/** Parses a JSON-LD `recipeIngredient` array of strings into structured ingredients. */
function parseIngredients(raw: unknown): ImportedIngredient[]
{
  if (!Array.isArray(raw)) return [];
  return raw.map((item) =>
  {
    if (typeof item === 'string') return parseIngredientString(item);
    return { name: String(item) };
  }).filter(i => i.name.length > 0);
}

/** Fallback parser when no JSON-LD is found. Extracts name from og:title/h1 and ingredients from common CSS selectors. */
function fallbackParse(html: string): Partial<ImportedRecipe>
{
  const $ = cheerio.load(html);
  const result: Partial<ImportedRecipe> = {};

  // Try og:title or page title
  result.name = $('meta[property="og:title"]').attr('content')
    || $('h1').first().text().trim()
    || $('title').text().trim()
    || '';

  // Try to find ingredients from common selectors
  const ingredients: ImportedIngredient[] = [];
  const ingredientSelectors = [
    '.ingredients td', '.ingredient', '[itemprop="recipeIngredient"]',
    '.recipe-ingredients li', '.zutat',
  ];
  for (const sel of ingredientSelectors)
  {
    $(sel).each((_, el) =>
    {
      const text = $(el).text().trim();
      if (text) ingredients.push(parseIngredientString(text));
    });
    if (ingredients.length > 0) break;
  }
  result.ingredients = ingredients;

  return result;
}

/**
 * Fetches a recipe URL and extracts structured data.
 * Primarily uses JSON-LD Schema.org Recipe markup (Chefkoch.de, EatSmarter, etc.).
 * Falls back to HTML parsing (og:title, common ingredient selectors) when no JSON-LD is present.
 * @param url - The recipe page URL to import from.
 * @returns Parsed recipe data ready for review/editing before saving.
 * @throws Error if the URL cannot be fetched (non-2xx status).
 */
export async function importRecipeFromUrl(url: string): Promise<ImportedRecipe>
{
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; VorratsCheck/1.0)',
      Accept: 'text/html',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);

  const html = await res.text();
  const jsonLd = extractJsonLd(html);

  if (jsonLd)
  {
    const cookTime = parseIsoDuration(String(jsonLd.totalTime || jsonLd.cookTime || jsonLd.prepTime || ''));
    const $ = cheerio.load(html);

    // Chefkoch.de stores difficulty in a specific element
    const difficultyText = $('[class*="difficulty"]').text()
      || $('[class*="Difficulty"]').text()
      || '';

    return {
      name: String(jsonLd.name || ''),
      ingredients: parseIngredients(jsonLd.recipeIngredient),
      instructions: parseInstructions(jsonLd.recipeInstructions),
      cookingTime: cookTime || 30,
      difficulty: mapDifficulty(difficultyText || String(jsonLd.difficulty || '')),
      servings: parseServings(jsonLd.recipeYield),
      sourceUrl: url,
      fromJsonLd: true,
    };
  }

  // Fallback: parse HTML directly
  const fallback = fallbackParse(html);
  return {
    name: fallback.name || 'Importiertes Rezept',
    ingredients: fallback.ingredients || [],
    instructions: [],
    cookingTime: 30,
    difficulty: 'medium',
    servings: 4,
    sourceUrl: url,
    fromJsonLd: false,
  };
}
