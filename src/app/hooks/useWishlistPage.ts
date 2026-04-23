import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useTranslation } from '../lib/i18n';
import type { WishListItem } from '../stores/wishlistStore';
import type { WishlistFormData } from '../components/wishlist';

export const initialWishlistFormData: WishlistFormData = {
  name: '',
  category: '',
  brand: '',
  priority: 'medium',
};

/**
 * Hook for the Wishlist page: form state (add/edit), grouped items, and CRUD handlers.
 */
export function useWishlistPage()
{
  const { t } = useTranslation();
  const wishList = useWishlistStore(s => s.items);
  const wishlistError = useWishlistStore(s => s.error);
  const addWishListItem = useWishlistStore(s => s.add);
  const updateWishListItem = useWishlistStore(s => s.update);
  const deleteWishListItem = useWishlistStore(s => s.remove);
  const categories = useCategoriesStore(s => s.items);

  // State for the add/edit dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WishlistFormData>(initialWishlistFormData);

  const groupedByPriority = useMemo(
    () => ({
      high: wishList.filter(item => item.priority === 'high'),
      medium: wishList.filter(item => item.priority === 'medium'),
      low: wishList.filter(item => item.priority === 'low'),
    }),
    [wishList]
  );

  const openAdd = () =>
  {
    setEditingId(null);
    setFormData(initialWishlistFormData);
    setShowAddDialog(true);
  };

  const openEdit = (item: WishListItem) =>
  {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category ?? '',
      brand: item.brand ?? '',
      priority: item.priority,
    });
    setShowAddDialog(true);
  };

  const handleCloseDialog = (open: boolean) =>
  {
    if (!open)
    {
      setEditingId(null);
      setFormData(initialWishlistFormData);
    }
    setShowAddDialog(open);
  };

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!formData.name)
    {
      toast.error(t('wishlist.nameRequired'));
      return;
    }
    try
    {
      const payload = {
        name: formData.name,
        type: 'specific' as const,
        category: formData.category || undefined,
        brand: formData.brand || undefined,
        priority: formData.priority,
      };
      if (editingId)
      {
        await updateWishListItem(editingId, payload);
        toast.success(t('wishlist.itemUpdated'));
      }
      else
      {
        await addWishListItem(payload);
        toast.success(t('wishlist.itemAdded'));
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
      await deleteWishListItem(id);
      toast.success(t('common.removed', { name }));
    }
    catch (err)
    {
      toast.error((err as Error).message);
    }
  };

  return {
    wishList,
    wishlistError,
    categories,
    showAddDialog,
    editingId,
    formData,
    setFormData,
    groupedByPriority,
    openAdd,
    openEdit,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
  };
}
