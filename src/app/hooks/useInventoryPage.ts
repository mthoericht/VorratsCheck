import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useInventoryStore } from '../stores/inventoryStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { INVENTORY_LOCATION_OPTIONS } from '../lib/inventory';
import { lookupProductByBarcode } from '../lib/productLookup';
import type { InventoryItem } from '../stores/inventoryStore';

export const initialInventoryFormData = {
  name: '',
  category: '',
  brand: '',
  barcode: '',
  quantity: '',
  unit: 'stk',
  expiryDate: '',
  location: '',
};

export type InventoryFormData = typeof initialInventoryFormData;

/**
 * Hook for the Inventory page: form state (add/edit), filters, filtered list,
 * and CRUD handlers. Exposes everything needed by the page and child components.
 */
export function useInventoryPage()
{
  const inventory = useInventoryStore(s => s.items);
  const addInventoryItem = useInventoryStore(s => s.add);
  const updateInventoryItem = useInventoryStore(s => s.update);
  const deleteInventoryItem = useInventoryStore(s => s.remove);
  const categories = useCategoriesStore(s => s.items);

  const [showScanner, setShowScanner] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [formData, setFormData] = useState<InventoryFormData>(initialInventoryFormData);

  const filterCategories = useMemo(
    () => Array.from(new Set(inventory.map(item => item.category))),
    [inventory]
  );
  const locationOptions = INVENTORY_LOCATION_OPTIONS;

  const filteredInventory = useMemo(
    () =>
      inventory.filter(item =>
      {
        const matchCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchLocation = filterLocation === 'all' || item.location === filterLocation;
        return matchCategory && matchLocation;
      }),
    [inventory, filterCategory, filterLocation]
  );

  const handleBarcodeScanned = async (barcode: string) =>
  {
    setShowScanner(false);

    try
    {
      const product = await lookupProductByBarcode(barcode);
      setFormData(prev => ({
        ...prev,
        barcode: barcode.trim(),
        name: product?.name ?? prev.name,
        brand: product?.brand ?? prev.brand,
      }));

      setShowAddDialog(true);

      if (product?.name)
        toast.success(`„${product.name}" gefunden – Formular ausgefüllt`);
      else
        toast.success(`Barcode ${barcode} gescannt`);
    }
    catch
    {
      setFormData(prev => ({ ...prev, barcode: barcode.trim() }));
      setShowAddDialog(true);
      toast.success(`Barcode ${barcode} gescannt`);
    }
  };

  const openAdd = () =>
  {
    setFormData(initialInventoryFormData);
    setShowAddDialog(true);
  };

  const closeAdd = () =>
  {
    setShowAddDialog(false);
    setFormData(initialInventoryFormData);
  };

  const openEdit = (item: InventoryItem) =>
  {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand ?? '',
      barcode: item.barcode ?? '',
      quantity: String(item.quantity),
      unit: item.unit,
      expiryDate: item.expiryDate ?? '',
      location: item.location ?? '',
    });
  };

  const closeEdit = () =>
  {
    setEditingItem(null);
  };

  const handleAddDialogOpenChange = (open: boolean) =>
  {
    setShowAddDialog(open);
    if (!open) closeAdd();
  };

  const handleEditDialogOpenChange = (open: boolean) =>
  {
    if (!open) closeEdit();
  };

  const openScannerFromAdd = () =>
  {
    setShowAddDialog(false);
    setShowScanner(true);
  };

  const openScannerFromEdit = () =>
  {
    closeEdit();
    setShowScanner(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!formData.name || !formData.category)
    {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    const parsedQty = formData.quantity.trim() ? parseFloat(formData.quantity) : NaN;
    const quantityVal = Number.isFinite(parsedQty) ? parsedQty : 1;
    const unitVal = formData.unit || 'stk';
    try
    {
      await addInventoryItem({
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        barcode: formData.barcode || undefined,
        quantity: quantityVal,
        unit: unitVal,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
      });
      toast.success('Artikel hinzugefügt');
      closeAdd();
    }
    catch (err)
    {
      toast.error((err as Error).message);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!editingItem || !formData.name || !formData.category)
    {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    const parsedQty = formData.quantity.trim() ? parseFloat(formData.quantity) : NaN;
    const quantityVal = Number.isFinite(parsedQty) ? parsedQty : 1;
    const unitVal = formData.unit || 'stk';
    try
    {
      await updateInventoryItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        barcode: formData.barcode || undefined,
        quantity: quantityVal,
        unit: unitVal,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
      });
      toast.success('Artikel aktualisiert');
      closeEdit();
    }
    catch (err)
    {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) =>
  {
    try
    {
      await deleteInventoryItem(id);
      toast.success(`${name} wurde entfernt`);
    }
    catch (err)
    {
      toast.error((err as Error).message);
    }
  };

  return {
    inventory,
    categories,
    showScanner,
    setShowScanner,
    showAddDialog,
    editingItem,
    formData,
    setFormData,
    filterCategory,
    setFilterCategory,
    filterLocation,
    setFilterLocation,
    filterCategories,
    locationOptions,
    filteredInventory,
    handleBarcodeScanned,
    openAdd,
    openEdit,
    handleAddDialogOpenChange,
    handleEditDialogOpenChange,
    openScannerFromAdd,
    openScannerFromEdit,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
  };
}
