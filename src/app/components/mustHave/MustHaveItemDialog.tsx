import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Quantity } from '../Quantity';
import type { Category } from '../../stores/categoriesStore';
import { useTranslation } from '../../lib/i18n';

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
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingId ? t('mustHave.editTitle') : t('mustHave.addTitle')}</DialogTitle>
          <DialogDescription>{t('mustHave.subtitle')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('common.name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t('mustHave.namePlaceholder')}
              aria-describedby="musthave-name-help"
              required
            />
            <p id="musthave-name-help" className="text-sm text-gray-500 mt-1">
              {t('mustHave.nameHelp')}
            </p>
          </div>
          <div>
            <Label htmlFor="category">{t('common.category')}</Label>
            <Select
              value={formData.category || 'none'}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, category: v === 'none' ? '' : v }))}
            >
              <SelectTrigger id="category" aria-describedby="musthave-category-help">
                <SelectValue placeholder={t('mustHave.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('common.none')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="musthave-category-help" className="text-sm text-gray-500 mt-1">
              {t('mustHave.categoryHelp')}
            </p>
          </div>
          <Quantity
            label={t('mustHave.minQuantityLabel')}
            quantity={formData.minQuantity}
            unit={formData.unit}
            onQuantityChange={(value) => setFormData((prev) => ({ ...prev, minQuantity: value }))}
            onUnitChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
            placeholder={t('mustHave.minQuantityPlaceholder')}
            optional={false}
            idPrefix="musthave"
          />
          <p className="text-sm text-gray-500 -mt-2">
            {t('mustHave.minQuantityHelp')}
          </p>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {editingId ? t('common.save') : t('common.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
