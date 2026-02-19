import { useState } from 'react';
import { toast } from 'sonner';
import { useRecipesStore } from '../stores/recipesStore';
import type { Recipe } from '../stores/recipesStore';
import type { RecipeIngredient } from '../lib/recipeIngredients';

const initialFormData = {
  name: '',
  ingredients: [{ name: '', unit: 'Stück' }] as RecipeIngredient[],
  instructions: '',
  cookingTime: '',
  difficulty: 'easy' as 'easy' | 'medium' | 'hard',
  servings: '',
};

export type RecipeFormData = typeof initialFormData;

/** Form state and handlers for add/edit recipe dialog. */
export function useRecipeForm() 
{
  const addRecipe = useRecipesStore((s) => s.add);
  const updateRecipe = useRecipesStore((s) => s.update);
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const openAdd = () => 
  {
    setEditingRecipe(null);
    setFormData(initialFormData);
    setIsOpen(true);
  };

  const openEdit = (recipe: Recipe) => 
  {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      ingredients:
        recipe.ingredients.length > 0
          ? recipe.ingredients.map((ing) => ({
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit || 'Stück',
            }))
          : [{ name: '', unit: 'Stück' }],
      instructions: recipe.instructions.join('\n'),
      cookingTime: recipe.cookingTime.toString(),
      difficulty: recipe.difficulty,
      servings: recipe.servings.toString(),
    });
    setIsOpen(true);
  };

  const close = () => 
  {
    setIsOpen(false);
    setEditingRecipe(null);
  };

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    const instructions = formData.instructions.split('\n').filter((i) => i.trim());
    const ingredientsFiltered = formData.ingredients
      .map((ing) => ({
        name: ing.name.trim(),
        quantity: ing.quantity != null && Number.isFinite(Number(ing.quantity)) ? Number(ing.quantity) : undefined,
        unit: ing.unit && ing.unit !== 'Stück' ? ing.unit : undefined,
      }))
      .filter((ing) => ing.name.length > 0);

    if (!formData.name || !formData.instructions || !formData.cookingTime || !formData.servings) 
    {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    if (ingredientsFiltered.length === 0) 
    {
      toast.error('Bitte geben Sie mindestens eine Zutat ein');
      return;
    }
    if (instructions.length === 0) 
    {
      toast.error('Bitte geben Sie mindestens einen Zubereitungsschritt ein');
      return;
    }

    const recipeData = {
      name: formData.name,
      ingredients: ingredientsFiltered.map(({ name, quantity, unit }) => 
        ({ name, ...(quantity != null && { quantity }), ...(unit != null && { unit }) })
      ),
      instructions,
      cookingTime: parseInt(formData.cookingTime),
      difficulty: formData.difficulty,
      servings: parseInt(formData.servings),
    };

    try 
    {
      if (editingRecipe) 
      {
        await updateRecipe(editingRecipe.id, recipeData);
        toast.success('Rezept aktualisiert');
      }
      else 
      {
        await addRecipe(recipeData);
        toast.success('Rezept hinzugefügt');
      }
      close();
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  return {
    formData,
    setFormData,
    isOpen,
    openAdd,
    openEdit,
    close,
    handleSubmit,
    editingRecipe,
  };
}
