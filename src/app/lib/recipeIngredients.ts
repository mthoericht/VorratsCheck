/**
 * Recipe ingredient with optional quantity and unit (for inventory matching).
 */

export interface RecipeIngredient {
  name: string;
  quantity?: number;
  unit?: string;
}

/** Formats ingredient for display (e.g. "400 g Spaghetti" or "Salz") */
export function formatIngredient(ing: RecipeIngredient): string 
{
  if (!ing.name) return '';
  if (ing.quantity != null && ing.unit) 
  {
    const q = Number(ing.quantity);
    if (Number.isFinite(q)) return `${ing.quantity} ${ing.unit} ${ing.name}`;
  }
  return ing.name;
}
