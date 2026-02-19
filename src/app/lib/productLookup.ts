/**
 * Result of a barcode/product lookup. Maps to inventory form fields.
 */
export interface ProductLookupResult {
  name?: string;
  brand?: string;
  category?: string;
}

const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.net/api/v2/product';

/**
 * Looks up product data by barcode via Open Food Facts API.
 * Returns null if not found or on network/API error.
 */
export async function lookupProductByBarcode(barcode: string): Promise<ProductLookupResult | null>
{
  const code = barcode.trim();
  if (!code) return null;

  try
  {
    const url = `${OPEN_FOOD_FACTS_API}/${encodeURIComponent(code)}?fields=product_name,brands,categories`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const name = p.product_name?.trim() || undefined;
    const brand = p.brands?.split(',')[0]?.trim() || undefined;
    const categoriesStr = p.categories;
    let category: string | undefined;
    if (categoriesStr && typeof categoriesStr === 'string')
    {
      const first = categoriesStr.split(',')[0]?.trim();
      category = first?.replace(/^en:/i, '').replace(/-/g, ' ') || undefined;
    }

    return { name, brand, category };
  }
  catch
  {
    return null;
  }
}
