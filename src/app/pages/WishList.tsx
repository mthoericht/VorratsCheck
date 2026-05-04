import { Button } from '../components/ui/button';
import { Box, Stack, Typography } from '@mui/material';
import { Plus } from '@/app/lib/icons';
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
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {t('wishlist.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('wishlist.subtitle')}
          </Typography>
        </Box>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          {t('wishlist.addItem')}
        </Button>
      </Box>

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
    </Stack>
  );
}
