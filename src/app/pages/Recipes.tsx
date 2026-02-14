import React, { useState, useMemo } from 'react';
import { useRecipesStore } from '../stores/recipesStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ChefHat, Clock, TrendingUp, CheckCircle2, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import type { Recipe } from '../stores/recipesStore';

export function Recipes() 
{
  const inventory = useInventoryStore((s) => s.items);
  const recipes = useRecipesStore((s) => s.items);
  const addRecipe = useRecipesStore((s) => s.add);
  const updateRecipe = useRecipesStore((s) => s.update);
  const deleteRecipe = useRecipesStore((s) => s.remove);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'time'>('match');
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    servings: '',
  });

  interface RecipeWithMatch extends Recipe {
    availableIngredients: string[];
    missingIngredients: string[];
    matchPercentage: number;
  }

  const recipesWithMatch = useMemo(() => 
  {
    return recipes.map(recipe => 
    {
      const availableIngredients = recipe.ingredients.filter(ingredient =>
        inventory.some(item =>
          item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          item.category.toLowerCase().includes(ingredient.toLowerCase())
        )
      );

      const missingIngredients = recipe.ingredients.filter(ingredient =>
        !inventory.some(item =>
          item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          item.category.toLowerCase().includes(ingredient.toLowerCase())
        )
      );

      const matchPercentage = recipe.ingredients.length > 0 
        ? (availableIngredients.length / recipe.ingredients.length) * 100 
        : 0;

      return {
        ...recipe,
        availableIngredients,
        missingIngredients,
        matchPercentage,
      };
    });
  }, [inventory, recipes]);

  const sortedRecipes = useMemo(() => 
  {
    const sorted = [...recipesWithMatch];
    if (sortBy === 'match') 
    {
      sorted.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
    else 
    {
      sorted.sort((a, b) => a.cookingTime - b.cookingTime);
    }
    return sorted;
  }, [recipesWithMatch, sortBy]);

  const handleOpenAddDialog = () => 
  {
    setEditingRecipe(null);
    setFormData({
      name: '',
      ingredients: '',
      instructions: '',
      cookingTime: '',
      difficulty: 'easy',
      servings: '',
    });
    setShowAddEditDialog(true);
  };

  const handleOpenEditDialog = (recipe: Recipe) => 
  {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
      cookingTime: recipe.cookingTime.toString(),
      difficulty: recipe.difficulty,
      servings: recipe.servings.toString(),
    });
    setSelectedRecipe(null);
    setShowAddEditDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();

    if (!formData.name || !formData.ingredients || !formData.instructions || !formData.cookingTime || !formData.servings) 
    {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    const ingredients = formData.ingredients.split('\n').filter(i => i.trim());
    const instructions = formData.instructions.split('\n').filter(i => i.trim());

    if (ingredients.length === 0) 
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
      ingredients,
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
      setShowAddEditDialog(false);
      setEditingRecipe(null);
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

  const getDifficultyColor = (difficulty: string) => 
  {
    switch (difficulty) 
    {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => 
  {
    switch (difficulty) 
    {
      case 'easy': return 'Einfach';
      case 'medium': return 'Mittel';
      case 'hard': return 'Schwer';
      default: return difficulty;
    }
  };

  const fullMatchRecipes = sortedRecipes.filter(r => r.matchPercentage === 100);
  const partialMatchRecipes = sortedRecipes.filter(r => r.matchPercentage > 0 && r.matchPercentage < 100);
  const noMatchRecipes = sortedRecipes.filter(r => r.matchPercentage === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Rezepte</h2>
          <p className="text-gray-600 mt-1">Basierend auf Ihrem aktuellen Vorrat</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'match' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('match')}
          >
            Nach Verfügbarkeit
          </Button>
          <Button
            variant={sortBy === 'time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('time')}
          >
            Nach Zeit
          </Button>
          <Dialog open={showAddEditDialog} onOpenChange={(open) => 
          {
            setShowAddEditDialog(open);
            if (open) 
            {
              handleOpenAddDialog();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Rezept hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipe ? 'Rezept bearbeiten' : 'Neues Rezept'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Rezeptname *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Spaghetti Bolognese"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="servings">Portionen *</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={formData.servings}
                      onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                      placeholder="z.B. 4"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cookingTime">Zeit (Min) *</Label>
                    <Input
                      id="cookingTime"
                      type="number"
                      min="1"
                      value={formData.cookingTime}
                      onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                      placeholder="z.B. 30"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Schwierigkeit *</Label>
                    <Select value={formData.difficulty} onValueChange={(value: string) => setFormData({ ...formData, difficulty: value as 'easy' | 'medium' | 'hard' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Einfach</SelectItem>
                        <SelectItem value="medium">Mittel</SelectItem>
                        <SelectItem value="hard">Schwer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ingredients">Zutaten * (eine pro Zeile)</Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Spaghetti&#10;Tomaten passiert&#10;Hackfleisch&#10;Zwiebeln"
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Jede Zutat in eine neue Zeile schreiben
                  </p>
                </div>

                <div>
                  <Label htmlFor="instructions">Zubereitung * (ein Schritt pro Zeile)</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Zwiebeln fein hacken&#10;In Olivenöl anbraten&#10;Hackfleisch hinzufügen"
                    rows={8}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Jeden Zubereitungsschritt in eine neue Zeile schreiben
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => 
                    {
                      setShowAddEditDialog(false);
                      setEditingRecipe(null);
                    }} 
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingRecipe ? 'Aktualisieren' : 'Hinzufügen'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Sofort kochbar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fullMatchRecipes.length}</div>
            <p className="text-xs text-gray-600 mt-1">Alle Zutaten vorhanden</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Teilweise möglich</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{partialMatchRecipes.length}</div>
            <p className="text-xs text-gray-600 mt-1">Einige Zutaten fehlen</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Gesamt Rezepte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{recipes.length}</div>
            <p className="text-xs text-gray-600 mt-1">In der Sammlung</p>
          </CardContent>
        </Card>
      </div>

      {recipes.length === 0 && (
        <Card className="p-12 text-center">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Noch keine Rezepte vorhanden</p>
          <Button className="mt-4" onClick={handleOpenAddDialog}>
            Erstes Rezept hinzufügen
          </Button>
        </Card>
      )}

      {/* Full Match Recipes */}
      {fullMatchRecipes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Sofort kochbar ({fullMatchRecipes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullMatchRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onEdit={() => handleOpenEditDialog(recipe)}
                onDelete={(e) => handleDelete(recipe.id, recipe.name, e)}
                getDifficultyColor={getDifficultyColor}
                getDifficultyLabel={getDifficultyLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Partial Match Recipes */}
      {partialMatchRecipes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            Teilweise möglich ({partialMatchRecipes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partialMatchRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onEdit={() => handleOpenEditDialog(recipe)}
                onDelete={(e) => handleDelete(recipe.id, recipe.name, e)}
                getDifficultyColor={getDifficultyColor}
                getDifficultyLabel={getDifficultyLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Match Recipes */}
      {noMatchRecipes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-gray-600" />
            Weitere Rezepte ({noMatchRecipes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {noMatchRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onEdit={() => handleOpenEditDialog(recipe)}
                onDelete={(e) => handleDelete(recipe.id, recipe.name, e)}
                getDifficultyColor={getDifficultyColor}
                getDifficultyLabel={getDifficultyLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recipe Detail Dialog */}
      {selectedRecipe && (
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                {selectedRecipe.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Meta Info */}
              <div className="flex gap-4 flex-wrap">
                <Badge className={getDifficultyColor(selectedRecipe.difficulty)}>
                  {getDifficultyLabel(selectedRecipe.difficulty)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedRecipe.cookingTime} Min
                </Badge>
                <Badge variant="outline">
                  {selectedRecipe.servings} Portionen
                </Badge>
                <Badge 
                  className={
                    selectedRecipe.matchPercentage === 100 
                      ? 'bg-green-600 text-white' 
                      : selectedRecipe.matchPercentage > 0 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-600 text-white'
                  }
                >
                  {Math.round(selectedRecipe.matchPercentage)}% Verfügbar
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleOpenEditDialog(selectedRecipe)}
                >
                  <Edit className="w-4 h-4" />
                  Bearbeiten
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => 
                  {
                    handleDelete(selectedRecipe.id, selectedRecipe.name, e);
                    setSelectedRecipe(null);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Löschen
                </Button>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold mb-3">Zutaten</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => 
                  {
                    const isAvailable = selectedRecipe.availableIngredients?.includes(ingredient);
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 p-2 rounded ${
                          isAvailable ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {isAvailable ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        <span className={isAvailable ? 'text-green-900' : 'text-red-900'}>
                          {ingredient}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-3">Zubereitung</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {selectedRecipe.missingIngredients && selectedRecipe.missingIngredients.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    Fehlende Zutaten ({selectedRecipe.missingIngredients.length})
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {selectedRecipe.missingIngredients.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function RecipeCard({ 
  recipe, 
  onClick,
  onEdit,
  onDelete,
  getDifficultyColor, 
  getDifficultyLabel 
}: { 
recipe: Recipe;
  onClick: () => void;
  onEdit: () => void;
  onDelete: (e: React.MouseEvent) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}) 
{
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              {recipe.name}
            </CardTitle>
            <CardDescription>
              {recipe.servings} Portionen · {recipe.cookingTime} Minuten
            </CardDescription>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => 
              {
                e.stopPropagation();
                onEdit();
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {getDifficultyLabel(recipe.difficulty)}
          </Badge>
          <Badge 
            className={
              recipe.matchPercentage === 100 
                ? 'bg-green-600 text-white' 
                : recipe.matchPercentage > 0 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-600 text-white'
            }
          >
            {Math.round(recipe.matchPercentage)}% verfügbar
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Zutaten:</span>
            <span className="font-medium">
              {recipe.availableIngredients?.length || 0} / {recipe.ingredients.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                recipe.matchPercentage === 100 
                  ? 'bg-green-600' 
                  : recipe.matchPercentage > 0 
                    ? 'bg-yellow-600' 
                    : 'bg-gray-400'
              }`}
              style={{ width: `${recipe.matchPercentage}%` }}
            />
          </div>
        </div>

        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <div className="text-sm text-gray-600">
            Fehlt: {recipe.missingIngredients.slice(0, 2).join(', ')}
            {recipe.missingIngredients.length > 2 && ` +${recipe.missingIngredients.length - 2}`}
          </div>
        )}

        <Button className="w-full gap-2" variant="outline">
          <ChefHat className="w-4 h-4" />
          Rezept anzeigen
        </Button>
      </CardContent>
    </Card>
  );
}