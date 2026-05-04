import { useInventoryPage } from '../hooks/useInventoryPage';
import { Button } from '../components/ui/button';
import { Box, Stack, Typography } from '@mui/material';
import { Plus, Scan } from '@/app/lib/icons';
import { BarcodeScanner } from '../components/BarcodeScanner';
import {
  InventoryItemFormDialog,
  InventoryItemCard,
  InventoryFilter,
  InventoryEmptyState,
} from '../components/inventory';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function Inventory()
{
  const { t } = useTranslation();
  const {
    inventory,
    inventoryError,
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
  } = useInventoryPage();

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
            {t('inventory.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('inventory.itemCount', { count: inventory.length })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button onClick={() => setShowScanner(true)} variant="outline" className="gap-2">
            <Scan className="w-4 h-4" />
            {t('inventory.scanBarcode')}
          </Button>
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            {t('inventory.addItem')}
          </Button>
        </Box>
      </Box>

      <StoreErrorAlert error={inventoryError} />

      <InventoryItemFormDialog
        open={showAddDialog}
        onOpenChange={handleAddDialogOpenChange}
        title={t('inventory.newItem')}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitAdd}
        submitLabel={t('common.add')}
        onScanClick={openScannerFromAdd}
        categories={categories}
        idPrefix="add"
      />

      <InventoryItemFormDialog
        open={editingItem !== null}
        onOpenChange={handleEditDialogOpenChange}
        title={t('inventory.editItem')}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitEdit}
        submitLabel={t('common.save')}
        onScanClick={openScannerFromEdit}
        categories={categories}
        idPrefix="edit"
      />

      <InventoryFilter
        locationOptions={locationOptions}
        filterLocation={filterLocation}
        onLocationChange={setFilterLocation}
        filterCategories={filterCategories}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {filteredInventory.map(item => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </Box>

      {filteredInventory.length === 0 && (
        <InventoryEmptyState onAddClick={openAdd} />
      )}

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Stack>
  );
}
