import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Quantity } from '../Quantity';
import { Plus, Trash2 } from 'lucide-react';
import type { RecipeFormApi } from '../../hooks/useRecipesPage';
import { DIFFICULTIES, type Difficulty } from '@shared/constants';

interface RecipeEditDialogProps {
  form: RecipeFormApi;
  trigger: React.ReactNode;
}

/** Add/Edit recipe dialog with form (name, ingredients, instructions, etc.). */
export function RecipeEditDialog({ form, trigger }: RecipeEditDialogProps) 
{
  return (
    <Dialog open={form.isOpen} onOpenChange={(open) => { if (!open) form.close(); }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form.editingRecipe ? 'Rezept bearbeiten' : 'Neues Rezept'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Rezeptname *</Label>
            <Input
              id="name"
              value={form.formData.name}
              onChange={(e) => form.setFormData({ ...form.formData, name: e.target.value })}
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
                min={1}
                value={form.formData.servings}
                onChange={(e) => form.setFormData({ ...form.formData, servings: e.target.value })}
                placeholder="z.B. 4"
                required
              />
            </div>
            <div>
              <Label htmlFor="cookingTime">Zeit (Min) *</Label>
              <Input
                id="cookingTime"
                type="number"
                min={1}
                value={form.formData.cookingTime}
                onChange={(e) => form.setFormData({ ...form.formData, cookingTime: e.target.value })}
                placeholder="z.B. 30"
                required
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Schwierigkeit *</Label>
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
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Zutaten *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setFormData({
                    ...form.formData,
                    ingredients: [...form.formData.ingredients, { name: '', unit: 'Stück' }],
                  })}
              >
                <Plus className="w-4 h-4 mr-1" />
                Zutat hinzufügen
              </Button>
            </div>
            <div className="space-y-3">
              {form.formData.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2 items-center flex-wrap">
                  <Input
                    placeholder="z. B. Salz, Spaghetti"
                    value={ing.name}
                    onChange={(e) => 
                    {
                      const next = [...form.formData.ingredients];
                      next[index] = { ...next[index], name: e.target.value };
                      form.setFormData({ ...form.formData, ingredients: next });
                    }}
                    className="flex-1 min-w-[140px]"
                  />
                  <Quantity
                    quantity={ing.quantity ?? ''}
                    unit={ing.unit || 'Stück'}
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => 
                    {
                      const next = form.formData.ingredients.filter((_, i) => i !== index);
                      form.setFormData({
                        ...form.formData,
                        ingredients: next.length > 0 ? next : [{ name: '', unit: 'Stück' }],
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Optional: Menge und Einheit für Vorrats-Matching angeben (z. B. 200 g Reis).
            </p>
          </div>

          <div>
            <Label htmlFor="instructions">Zubereitung * (ein Schritt pro Zeile)</Label>
            <Textarea
              id="instructions"
              value={form.formData.instructions}
              onChange={(e) => form.setFormData({ ...form.formData, instructions: e.target.value })}
              placeholder="Zwiebeln fein hacken&#10;In Olivenöl anbraten&#10;Hackfleisch hinzufügen"
              rows={8}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Jeden Zubereitungsschritt in eine neue Zeile schreiben
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={form.close} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1">
              {form.editingRecipe ? 'Aktualisieren' : 'Hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
