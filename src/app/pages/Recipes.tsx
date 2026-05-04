import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  RecipeEditDialog,
  RecipeImportDialog,
  RecipeListSection,
  RecipeViewDialog,
} from '../components/recipe';
import { ChefHat, CheckCircle2, XCircle, Plus, TrendingUp, Globe, Search } from '@/app/lib/icons';
import { useRecipesPage } from '../hooks/useRecipesPage';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';
import { Input } from '../components/ui/input';
import { getAppPalette } from '../lib/muiTheme';

export function Recipes()
{
  const { t } = useTranslation();
  const theme = useTheme();
  const app = getAppPalette(theme);
  const success = app.success;
  const warning = app.warning;
  const neutral = app.neutral;
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
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {t('recipes.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('recipes.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
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
        </Box>
      </Box>

      <StoreErrorAlert error={recipesError} />

      {/* Search */}
      <Box className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('recipes.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label={t('recipes.searchPlaceholder')}
        />
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        <Card sx={{ borderColor: success.border, backgroundColor: success.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: success.text }}>
              {t('recipes.cookableNow')}
            </Typography>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: success.value, lineHeight: 1.2 }}>
              {fullMatchRecipes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">{t('recipes.allIngredientsAvailable')}</Typography>
          </Box>
        </Card>
        <Card sx={{ borderColor: warning.border, backgroundColor: warning.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: warning.text }}>
              {t('recipes.partiallyCookable')}
            </Typography>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: warning.value, lineHeight: 1.2 }}>
              {partialMatchRecipes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">{t('recipes.someIngredientsMissing')}</Typography>
          </Box>
        </Card>
        <Card sx={{ borderColor: neutral.border, backgroundColor: neutral.bg }}>
          <Box sx={{ p: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: neutral.text }}>
              {t('recipes.totalRecipes')}
            </Typography>
            <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: neutral.value, lineHeight: 1.2 }}>
              {recipes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">{t('recipes.inCollection')}</Typography>
          </Box>
        </Card>
      </Box>

      {recipes.length === 0 && (
        <Card className="p-12 text-center">
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <ChefHat className="w-12 h-12 text-gray-300" />
            <Typography color="text.secondary">{t('recipes.noRecipes')}</Typography>
            <Button className="mt-2" onClick={form.openAdd}>
              {t('recipes.addFirstRecipe')}
            </Button>
          </Stack>
        </Card>
      )}

      <RecipeListSection
        title={t('recipes.cookableNow')}
        icon={<CheckCircle2 style={{ width: 24, height: 24, color: '#16a34a' }} />}
        recipes={fullMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title={t('recipes.partiallyCookable')}
        icon={<TrendingUp style={{ width: 24, height: 24, color: '#ca8a04' }} />}
        recipes={partialMatchRecipes}
        onSelectRecipe={setSelectedRecipe}
        onEdit={(recipe) => form.openEdit(recipe)}
        onDelete={handleDelete}
      />

      <RecipeListSection
        title={t('recipes.moreRecipes')}
        icon={<XCircle style={{ width: 24, height: 24, color: '#6b7280' }} />}
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
    </Stack>
  );
}