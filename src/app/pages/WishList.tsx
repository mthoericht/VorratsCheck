import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import {
  WishlistItemDialog,
  WishlistStats,
  WishlistPrioritySection,
  WishlistEmptyState,
} from '../components/wishlist';
import { useWishlistPage } from '../hooks/useWishlistPage';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function WishList()
{
  const { t } = useTranslation();
  const {
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
  } = useWishlistPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('wishlist.title')}</h2>
          <p className="text-gray-600 mt-1">{t('wishlist.subtitle')}</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          {t('wishlist.addItem')}
        </Button>
      </div>

      <StoreErrorAlert error={wishlistError} />

      <WishlistItemDialog
        open={showAddDialog}
        onOpenChange={handleCloseDialog}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        onSubmit={handleSubmit}
        categories={categories}
      />

      <WishlistStats items={wishList} />

      {(['high', 'medium', 'low'] as const).map(priority => (
        <WishlistPrioritySection
          key={priority}
          priority={priority}
          items={groupedByPriority[priority]}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      ))}

      {wishList.length === 0 && <WishlistEmptyState onAddClick={openAdd} />}
    </div>
  );
}
