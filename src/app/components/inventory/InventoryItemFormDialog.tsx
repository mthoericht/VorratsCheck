import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Scan } from 'lucide-react';
import { Link } from 'react-router';
import { Quantity } from '../Quantity';
import type { InventoryFormData } from '../../hooks/useInventoryPage';
import type { Category } from '../../stores/categoriesStore';
import { INVENTORY_LOCATION_OPTIONS } from '../../lib/inventory';

interface InventoryItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: InventoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<InventoryFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  onScanClick: () => void;
  categories: Category[];
  idPrefix: string;
}

export function InventoryItemFormDialog({
  open,
  onOpenChange,
  title,
  formData,
  setFormData,
  onSubmit,
  submitLabel,
  onScanClick,
  categories,
  idPrefix,
}: InventoryItemFormDialogProps)
{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`${idPrefix}-name`}>Name *</Label>
            <Input
              id={`${idPrefix}-name`}
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Vollmilch"
              required
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-category`}>Kategorie *</Label>
            <Select
              value={formData.category || ''}
              onValueChange={v => setFormData(prev => ({ ...prev, category: v }))}
              required
            >
              <SelectTrigger id={`${idPrefix}-category`}>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    Keine Kategorien. <Link to="/categories" className="text-primary underline">Kategorien anlegen</Link>
                  </div>
                ) : (
                  categories.map(c => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-brand`}>Marke</Label>
            <Input
              id={`${idPrefix}-brand`}
              value={formData.brand}
              onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="Optional"
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-barcode`}>Barcode</Label>
            <div className="flex gap-2">
              <Input
                id={`${idPrefix}-barcode`}
                value={formData.barcode}
                onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="Optional"
              />
              <Button type="button" variant="outline" onClick={onScanClick}>
                <Scan className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Quantity
            quantity={formData.quantity}
            unit={formData.unit}
            onQuantityChange={value => setFormData(prev => ({ ...prev, quantity: value }))}
            onUnitChange={value => setFormData(prev => ({ ...prev, unit: value }))}
            label="Menge"
            placeholder="Optional (Standard: 1 Stück)"
            optional
            idPrefix={idPrefix}
          />

          <div>
            <Label htmlFor={`${idPrefix}-expiryDate`}>Mindesthaltbarkeitsdatum</Label>
            <Input
              id={`${idPrefix}-expiryDate`}
              type="date"
              value={formData.expiryDate}
              onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-location`}>Lagerort</Label>
            <Select
              value={formData.location}
              onValueChange={value => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger id={`${idPrefix}-location`}>
                <SelectValue placeholder="Lagerort wählen" />
              </SelectTrigger>
              <SelectContent>
                {INVENTORY_LOCATION_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1">
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
