import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { StatCard } from '../components/ui/stat-card';
import {
  RecipeEditDialog,
  RecipeImportDialog,
  RecipeListSection,
  RecipeViewDialog,
} from '../components/recipe';
import { ChefHat, CheckCircle2, XCircle, Plus, TrendingUp, Globe, Search } from 'lucide-react';
import { useRecipesPage } from '../hooks/useRecipesPage';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';
import { Input } from '../components/ui/input';

export function Recipes()
{
  const { t } = useTranslation();
  const {
    recipes,
    recipesError,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    fullMatchRecipes,
    partialMatchRecipes,
    noMatchRecipes,
    inventory,
    form,
    selectedRecipe,
    setSelectedRecipe,
    handleDelete,
  } = useRecipesPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('recipes.title')}</h2>
          <p className="text-gray-600 mt-1">{t('recipes.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={sortBy === 'match' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('match')}
          >
            {t('recipes.sortByAvailability')}
          </Button>
          <Button
            variant={sortBy === 'time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('time')}
          >
            {t('recipes.sortByTime')}
          </Button>
          <RecipeImportDialog
            trigger={
              <Button variant="outline" className="gap-2 whitespace-normal text-center min-w-0">
                <Globe className="w-4 h-4 shrink-0" />
                <span>{t('recipes.importRecipe')}</span>
              </Button>
            }
            onImported={form.openImported}
          />
          <RecipeEditDialog
            form={form}
            trigger={
              <Button className="gap-2 whitespace-normal text-center min-w-0" onClick={form.openAdd}>
                <Plus className="w-4 h-4 shrink-0" />
                <span>{t('recipes.addRecipe')}</span>
              </Button>
            }
          />
        </div>
      </div>

      <StoreErrorAlert error={recipesError} />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('recipes.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label={t('recipes.searchPlaceholder')}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title={t('recipes.cookableNow')}
          value={fullMatchRecipes.length}
          subtitle={t('recipes.allIngredientsAvailable')}
          className="border-green-200"
          titleClassName="text-sm font-medium text-green-800"
          valueClassName="text-2xl font-bold text-green-600"
        />
        <StatCard
          title={t('recipes.partiallyCookable')}
          value={partialMatchRecipes.length}
          subtitle={t('recipes.someIngredientsMissing')}
          className="border-yellow-200"
          titleClassName="text-sm font-medium text-yellow-800"
          valueClassName="text-2xl font-bold text-yellow-600"
        />
        <StatCard
          title={t('recipes.totalRecipes')}
          value={recipes.length}
          subtitle={t('recipes.inCollection')}
          className="border-gray-200"
          titleClassName="text-sm font-medium text-gray-800"
          valueClassName="text-2xl font-bold text-gray-600"
        />
      </div>

      {recipes.length === 0 && (
        <Card className="p-12 text-center">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('recipes.noRecipes')}</p>
          <Button className="mt-4" onClick={form.openAdd}>
            {t('recipes.addFirstRecipe')}
          </Button>
        </Card>
      )}

      <RecipeListSection
        title={t('recipes.cookableNow')}
        icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
        recipes={fullMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title={t('recipes.partiallyCookable')}
        icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
        recipes={partialMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title={t('recipes.moreRecipes')}
        icon={<XCircle className="w-6 h-6 text-gray-600" />}
        recipes={noMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={handleDelete}
      />

      <RecipeViewDialog
        recipe={selectedRecipe}
        inventory={inventory}
        onClose={() => setSelectedRecipe(null)}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={(e) => selectedRecipe && handleDelete(selectedRecipe.id, selectedRecipe.name, e)}
      />
    </div>
  );
}