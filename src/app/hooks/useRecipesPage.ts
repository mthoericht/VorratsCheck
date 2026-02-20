import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useRecipesStore } from '../stores/recipesStore';
import { useInventoryStore } from '../stores/inventoryStore';
import type { Recipe } from '../stores/recipesStore';
import { computeRecipesWithMatch, type RecipeIngredient, type RecipeWithMatch } from '../lib/recipe';
import type { Difficulty } from '@shared/constants';

const initialFormData = {
  name: '',
  ingredients: [{ name: '', unit: 'Stück' }] as RecipeIngredient[],
  instructions: '',
  cookingTime: '',
  difficulty: 'easy' as Difficulty,
  servings: '',
};

export type RecipeFormData = typeof initialFormData;

/** Form API returned by useRecipesPage (for RecipeEditDialog). */
export type RecipeFormApi = ReturnType<typeof useRecipesPage>['form'];

/**
 * Single hook for the Recipes page: match/sort state, form state for add/edit dialog,
 * and delete handler. Reads recipes and inventory from stores.
 */
export function useRecipesPage() 
{
  const inventory = useInventoryStore((s) => s.items);
  const recipes = useRecipesStore((s) => s.items);
  const addRecipe = useRecipesStore((s) => s.add);
  const updateRecipe = useRecipesStore((s) => s.update);
  const deleteRecipe = useRecipesStore((s) => s.remove);

  const [sortBy, setSortBy] = useState<'match' | 'time'>('match');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const recipesWithMatch = useMemo(
    () => computeRecipesWithMatch(recipes, inventory),
    [recipes, inventory]
  );

  const sortedRecipes = useMemo(() => 
  {
    const sorted = [...recipesWithMatch];
    if (sortBy === 'match') 
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    else 
      sorted.sort((a, b) => a.cookingTime - b.cookingTime);
    return sorted;
  }, [recipesWithMatch, sortBy]);

  const fullMatchRecipes = useMemo(
    () => sortedRecipes.filter((r) => r.matchPercentage === 100),
    [sortedRecipes]
  );

  const partialMatchRecipes = useMemo(
    () => sortedRecipes.filter((r) => r.matchPercentage > 0 && r.matchPercentage < 100),
    [sortedRecipes]
  );
  
  const noMatchRecipes = useMemo(
    () => sortedRecipes.filter((r) => r.matchPercentage === 0),
    [sortedRecipes]
  );

  const openAdd = () => 
  {
    setEditingRecipe(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const openEdit = (recipe: Recipe) => 
  {
    setSelectedRecipe(null);
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
    setIsFormOpen(true);
  };

  const closeForm = () => 
  {
    setIsFormOpen(false);
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
      closeForm();
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => 
  {
    e.stopPropagation();
    if (!confirm(`Möchten Sie das Rezept "${name}" wirklich löschen?`)) return;
    try 
    {
      await deleteRecipe(id);
      toast.success(`${name} wurde gelöscht`);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const form = {
    formData,
    setFormData,
    isOpen: isFormOpen,
    openAdd,
    openEdit,
    close: closeForm,
    handleSubmit,
    editingRecipe,
  };

  return {
    recipes,
    sortedRecipes,
    sortBy,
    setSortBy,
    fullMatchRecipes,
    partialMatchRecipes,
    noMatchRecipes,
    inventory,
    form,
    selectedRecipe,
    setSelectedRecipe,
    handleDelete,
  };
}
