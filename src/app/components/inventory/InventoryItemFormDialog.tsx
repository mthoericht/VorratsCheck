import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Scan } from '@/app/lib/icons';
import { Link } from 'react-router';
import { Quantity } from '../Quantity';
import { Box, Stack, Typography } from '@mui/material';
import type { InventoryFormData } from '../../hooks/useInventoryPage';
import type { Category } from '../../stores/categoriesStore';
import { INVENTORY_LOCATION_OPTIONS } from '../../lib/inventory';
import { useTranslation } from '../../lib/i18n';

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
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t('inventory.subtitle')}</DialogDescription>
        </DialogHeader>
        <Stack component="form" onSubmit={onSubmit} spacing={2}>
          <div>
            <Label htmlFor={`${idPrefix}-name`}>{t('inventory.nameLabel')}</Label>
            <Input
              id={`${idPrefix}-name`}
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('inventory.namePlaceholder')}
              required
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-category`}>{t('inventory.categoryLabel')}</Label>
            <Select
              value={formData.category || ''}
              onValueChange={v => setFormData(prev => ({ ...prev, category: v }))}
              required
            >
              <SelectTrigger id={`${idPrefix}-category`}>
                <SelectValue placeholder={t('inventory.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <Box sx={{ px: 1, py: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('inventory.noCategories')}{' '}
                      <Link to="/categories" className="text-primary underline">{t('inventory.createCategories')}</Link>
                    </Typography>
                  </Box>
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
            <Label htmlFor={`${idPrefix}-brand`}>{t('inventory.brandLabel')}</Label>
            <Input
              id={`${idPrefix}-brand`}
              value={formData.brand}
              onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder={t('common.optional')}
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-barcode`}>{t('inventory.barcodeLabel')}</Label>
            <div className="flex gap-2">
              <Input
                id={`${idPrefix}-barcode`}
                value={formData.barcode}
                onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder={t('common.optional')}
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
            label={t('inventory.quantityLabel')}
            placeholder={t('inventory.quantityPlaceholder')}
            optional
            idPrefix={idPrefix}
          />

          <div>
            <Label htmlFor={`${idPrefix}-expiryDate`}>{t('inventory.expiryLabel')}</Label>
            <Input
              id={`${idPrefix}-expiryDate`}
              type="date"
              value={formData.expiryDate}
              onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-location`}>{t('inventory.locationLabel')}</Label>
            <Select
              value={formData.location}
              onValueChange={value => setFormData(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger id={`${idPrefix}-location`}>
                <SelectValue placeholder={t('inventory.locationPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {INVENTORY_LOCATION_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t(`inventory.locations.${opt.id}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {submitLabel}
            </Button>
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
