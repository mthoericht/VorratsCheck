import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Quantity } from '../Quantity';
import { Plus, Trash2 } from '@/app/lib/icons';
import type { RecipeFormApi } from '../../hooks/useRecipesPage';
import { DIFFICULTIES, type Difficulty } from '@shared/constants';
import { useTranslation } from '../../lib/i18n';
import { Box, Stack, Typography } from '@mui/material';

interface RecipeEditDialogProps {
  form: RecipeFormApi;
  trigger: React.ReactNode;
}

/** Add/Edit recipe dialog with form (name, ingredients, instructions, etc.). */
export function RecipeEditDialog({ form, trigger }: RecipeEditDialogProps) 
{
  const { t } = useTranslation();

  return (
    <Dialog open={form.isOpen} onOpenChange={(open) => { if (!open) form.close(); }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form.editingRecipe ? t('recipes.editTitle') : t('recipes.addTitle')}
          </DialogTitle>
          <DialogDescription>{t('recipes.subtitle')}</DialogDescription>
        </DialogHeader>
        <Stack component="form" onSubmit={form.handleSubmit} spacing={2}>
          <div>
            <Label htmlFor="name">{t('recipes.recipeNameLabel')}</Label>
            <Input
              id="name"
              value={form.formData.name}
              onChange={(e) => form.setFormData({ ...form.formData, name: e.target.value })}
              placeholder={t('recipes.recipeNamePlaceholder')}
              required
            />
          </div>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <Box>
              <Label htmlFor="servings">{t('recipes.servingsLabel')}</Label>
              <Input
                id="servings"
                type="number"
                min={1}
                value={form.formData.servings}
                onChange={(e) => form.setFormData({ ...form.formData, servings: e.target.value })}
                placeholder={t('recipes.servingsPlaceholder')}
                required
              />
            </Box>
            <Box>
              <Label htmlFor="cookingTime">{t('recipes.cookingTimeLabel')}</Label>
              <Input
                id="cookingTime"
                type="number"
                min={1}
                value={form.formData.cookingTime}
                onChange={(e) => form.setFormData({ ...form.formData, cookingTime: e.target.value })}
                placeholder={t('recipes.cookingTimePlaceholder')}
                required
              />
            </Box>
            <Box>
              <Label htmlFor="difficulty">{t('recipes.difficultyLabel')}</Label>
              <Select
                value={form.formData.difficulty}
                onValueChange={(value: string) =>
                  form.setFormData({ ...form.formData, difficulty: value as Difficulty })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => (
                    <SelectItem key={d.value} value={d.value}>{t(`difficulties.${d.value}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Label>{t('recipes.ingredientsLabel')}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setFormData({
                    ...form.formData,
                    ingredients: [...form.formData.ingredients, { name: '', unit: 'stk' }],
                  })}
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('recipes.addIngredient')}
              </Button>
            </Box>
            <Stack spacing={1.5}>
              {form.formData.ingredients.map((ing, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gap: 1,
                    alignItems: 'center',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) auto auto' },
                  }}
                >
                  <Input
                    placeholder={t('recipes.ingredientPlaceholder')}
                    value={ing.name}
                    onChange={(e) => 
                    {
                      const next = [...form.formData.ingredients];
                      next[index] = { ...next[index], name: e.target.value };
                      form.setFormData({ ...form.formData, ingredients: next });
                    }}
                    style={{ minWidth: 180 }}
                  />
                  <Quantity
                    quantity={ing.quantity ?? ''}
                    unit={ing.unit || 'stk'}
                    onQuantityChange={(value) => 
                    {
                      const next = [...form.formData.ingredients];
                      const num = value === '' ? NaN : parseFloat(value);
                      next[index] = {
                        ...next[index],
                        quantity: Number.isFinite(num) ? num : undefined,
                      };
                      form.setFormData({ ...form.formData, ingredients: next });
                    }}
                    onUnitChange={(value) => 
                    {
                      const next = [...form.formData.ingredients];
                      next[index] = { ...next[index], unit: value };
                      form.setFormData({ ...form.formData, ingredients: next });
                    }}
                    idPrefix={`ing-${index}`}
                    compact
                    optional
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    sx={{ color: 'error.main', justifySelf: { md: 'start' } }}
                    onClick={() => 
                    {
                      const next = form.formData.ingredients.filter((_, i) => i !== index);
                      form.setFormData({
                        ...form.formData,
                        ingredients: next.length > 0 ? next : [{ name: '', unit: 'stk' }],
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('recipes.ingredientHelp')}
            </Typography>
          </Box>

          <div>
            <Label htmlFor="instructions">{t('recipes.instructionsLabel')}</Label>
            <Textarea
              id="instructions"
              value={form.formData.instructions}
              onChange={(e) => form.setFormData({ ...form.formData, instructions: e.target.value })}
              placeholder={t('recipes.instructionsPlaceholder')}
              rows={8}
              required
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('recipes.instructionsHelp')}
            </Typography>
          </div>

          <Box sx={{ display: 'flex', gap: 1, pt: 2 }}>
            <Button type="button" variant="outline" onClick={form.close} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {form.editingRecipe ? t('recipes.update') : t('common.add')}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
