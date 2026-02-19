import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  RecipeEditDialog,
  RecipeListSection,
  RecipeStatCard,
  RecipeViewDialog,
} from '../components/recipe';
import { ChefHat, CheckCircle2, XCircle, Plus, TrendingUp } from 'lucide-react';
import type { RecipeWithMatch } from '../lib/recipe';
import { useRecipesPage } from '../hooks/useRecipesPage';

export function Recipes() 
{
  const {
    recipes,
    sortBy,
    setSortBy,
    fullMatchRecipes,
    partialMatchRecipes,
    noMatchRecipes,
    inventory,
    form,
    handleDelete,
  } = useRecipesPage();
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);

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
          <RecipeEditDialog
            form={form}
            trigger={
              <Button className="gap-2" onClick={form.openAdd}>
                <Plus className="w-4 h-4" />
                Rezept hinzufügen
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecipeStatCard
          title="Sofort kochbar"
          value={fullMatchRecipes.length}
          subtitle="Alle Zutaten vorhanden"
          borderClassName="border-green-200"
          titleClassName="text-sm font-medium text-green-800"
          valueClassName="text-2xl font-bold text-green-600"
        />
        <RecipeStatCard
          title="Teilweise möglich"
          value={partialMatchRecipes.length}
          subtitle="Einige Zutaten fehlen"
          borderClassName="border-yellow-200"
          titleClassName="text-sm font-medium text-yellow-800"
          valueClassName="text-2xl font-bold text-yellow-600"
        />
        <RecipeStatCard
          title="Gesamt Rezepte"
          value={recipes.length}
          subtitle="In der Sammlung"
          borderClassName="border-gray-200"
          titleClassName="text-sm font-medium text-gray-800"
          valueClassName="text-2xl font-bold text-gray-600"
        />
      </div>

      {recipes.length === 0 && (
        <Card className="p-12 text-center">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Noch keine Rezepte vorhanden</p>
          <Button className="mt-4" onClick={form.openAdd}>
            Erstes Rezept hinzufügen
          </Button>
        </Card>
      )}

      <RecipeListSection
        title="Sofort kochbar"
        icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
        recipes={fullMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => { setSelectedRecipe(null); form.openEdit(recipe); }}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title="Teilweise möglich"
        icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
        recipes={partialMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => { setSelectedRecipe(null); form.openEdit(recipe); }}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title="Weitere Rezepte"
        icon={<XCircle className="w-6 h-6 text-gray-600" />}
        recipes={noMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => { setSelectedRecipe(null); form.openEdit(recipe); }}
        onDelete={handleDelete}
      />

      <RecipeViewDialog
        recipe={selectedRecipe}
        inventory={inventory}
        onClose={() => setSelectedRecipe(null)}
        onEdit={(recipe) => { setSelectedRecipe(null); form.openEdit(recipe); }}
        onDelete={(e) => selectedRecipe && handleDelete(selectedRecipe.id, selectedRecipe.name, e)}
      />
    </div>
  );
}