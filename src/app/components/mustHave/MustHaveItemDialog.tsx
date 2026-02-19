import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Quantity } from '../Quantity';
import type { Category } from '../../stores/categoriesStore';

export interface MustHaveFormData {
  name: string;
  category: string;
  minQuantity: string;
  unit: string;
}

interface MustHaveItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: MustHaveFormData;
  setFormData: React.Dispatch<React.SetStateAction<MustHaveFormData>>;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  categories: Category[];
}

export function MustHaveItemDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  editingId,
  onSubmit,
  categories,
}: MustHaveItemDialogProps) 
{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingId ? 'Must-Have Artikel bearbeiten' : 'Neuer Must-Have Artikel'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Butter, Milch, Eier, Nudeln"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Wird mit dem Namen der Vorratsartikel abgeglichen (z.B. „Butter“)
            </p>
          </div>
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select
              value={formData.category || 'none'}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, category: v === 'none' ? '' : v }))}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategorie wählen (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Optionale Einordnung (wird nur zur Anzeige genutzt)
            </p>
          </div>
          <Quantity
            label="Minimale Menge"
            quantity={formData.minQuantity}
            unit={formData.unit}
            onQuantityChange={(value) => setFormData((prev) => ({ ...prev, minQuantity: value }))}
            onUnitChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
            placeholder="z.B. 1, 2, 500"
            optional={false}
            idPrefix="musthave"
          />
          <p className="text-sm text-gray-500 -mt-2">
            Die Mindestmenge in der gewählten Einheit, die immer vorhanden sein sollte
          </p>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1">
              {editingId ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
