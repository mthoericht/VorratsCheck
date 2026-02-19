import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import {
  WishlistItemDialog,
  WishlistStats,
  WishlistPrioritySection,
  WishlistEmptyState,
} from '../components/wishlist';
import { useWishlistPage } from '../hooks/useWishlistPage';

export function WishList()
{
  const {
    wishList,
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
          <h2 className="text-3xl font-bold text-gray-900">Wunschliste</h2>
          <p className="text-gray-600 mt-1">Artikel die Sie bei Gelegenheit kaufen möchten</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Artikel hinzufügen
        </Button>
      </div>

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
