import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Category } from '../../stores/categoriesStore';
import { useTranslation } from '../../lib/i18n';

export interface WishlistFormData {
  name: string;
  category: string;
  brand: string;
  priority: 'low' | 'medium' | 'high';
}

interface WishlistItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: WishlistFormData;
  setFormData: React.Dispatch<React.SetStateAction<WishlistFormData>>;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  categories: Category[];
}

export function WishlistItemDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  editingId,
  onSubmit,
  categories,
}: WishlistItemDialogProps) 
{
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? t('wishlist.editTitle') : t('wishlist.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="wishlist-name">{t('common.name')}</Label>
            <Input
              id="wishlist-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t('wishlist.namePlaceholder')}
              required
            />
          </div>

          <div>
            <Label htmlFor="wishlist-category">{t('wishlist.categoryLabel')}</Label>
            <Select
              value={formData.category || 'none'}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, category: v === 'none' ? '' : v }))
              }
            >
              <SelectTrigger id="wishlist-category">
                <SelectValue placeholder={t('wishlist.categoryPlaceholder')} />
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
          </div>

          <div>
            <Label htmlFor="wishlist-brand">{t('wishlist.brandLabel')}</Label>
            <Input
              id="wishlist-brand"
              value={formData.brand}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
              placeholder={t('wishlist.brandPlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="wishlist-priority">{t('wishlist.priorityLabel')}</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))
              }
            >
              <SelectTrigger id="wishlist-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">{t('priorities.high')}</SelectItem>
                <SelectItem value="medium">{t('priorities.medium')}</SelectItem>
                <SelectItem value="low">{t('priorities.low')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
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
