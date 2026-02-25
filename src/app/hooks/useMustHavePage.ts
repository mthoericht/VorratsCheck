import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { getStockStatus } from '../lib/mustHave';
import { useTranslation } from '../lib/i18n';
import type { MustHaveItem } from '../stores/mustHaveStore';
import type { MustHaveFormData } from '../components/mustHave';

export const initialMustHaveFormData: MustHaveFormData = {
  name: '',
  category: '',
  minQuantity: '',
  unit: 'stk',
};

/**
 * Hook for the Must-Have page: form state (add/edit), stock counts, and CRUD handlers.
 */
export function useMustHavePage()
{
  const { t } = useTranslation();
  const mustHaveList = useMustHaveStore(s => s.items);
  const mustHaveError = useMustHaveStore(s => s.error);
  const addMustHaveItem = useMustHaveStore(s => s.add);
  const updateMustHaveItem = useMustHaveStore(s => s.update);
  const deleteMustHaveItem = useMustHaveStore(s => s.remove);
  const inventory = useInventoryStore(s => s.items);
  const categories = useCategoriesStore(s => s.items);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MustHaveFormData>(initialMustHaveFormData);

  const sufficientCount = useMemo(
    () => mustHaveList.filter(item => !getStockStatus(item, inventory).isLow).length,
    [mustHaveList, inventory]
  );

  const lowCount = useMemo(
    () => mustHaveList.filter(item => getStockStatus(item, inventory).isLow).length,
    [mustHaveList, inventory]
  );

  const openAdd = () =>
  {
    setEditingId(null);
    setFormData(initialMustHaveFormData);
    setShowAddDialog(true);
  };

  const openEdit = (item: MustHaveItem) =>
  {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category || '',
      minQuantity: String(item.minQuantity),
      unit: item.unit || 'stk',
    });
    setShowAddDialog(true);
  };

  const handleCloseDialog = (open: boolean) =>
  {
    if (!open)
    {
      setEditingId(null);
      setFormData(initialMustHaveFormData);
    }
    setShowAddDialog(open);
  };

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!formData.name)
    {
      toast.error(t('mustHave.nameRequired'));
      return;
    }
    const qty = formData.minQuantity === '' ? 1 : parseFloat(formData.minQuantity);
    if (!Number.isFinite(qty) || qty < 0)
    {
      toast.error(t('mustHave.invalidQuantity'));
      return;
    }
    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim() || undefined,
      minQuantity: Math.round(qty),
      unit: formData.unit || undefined,
    };
    try
    {
      if (editingId)
      {
        await updateMustHaveItem(editingId, payload);
        toast.success(t('mustHave.itemUpdated'));
      }
      else
      {
        await addMustHaveItem(payload);
        toast.success(t('mustHave.itemAdded'));
      }
      handleCloseDialog(false);
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
      await deleteMustHaveItem(id);
      toast.success(t('common.removed', { name }));
    }
    catch (err)
    {
      toast.error((err as Error).message);
    }
  };

  return {
    mustHaveList,
    mustHaveError,
    inventory,
    categories,
    showAddDialog,
    editingId,
    formData,
    setFormData,
    sufficientCount,
    lowCount,
    openAdd,
    openEdit,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  };
}
