import { useInventoryPage } from '../hooks/useInventoryPage';
import { Button } from '../components/ui/button';
import { Plus, Scan } from 'lucide-react';
import { BarcodeScanner } from '../components/BarcodeScanner';
import {
  InventoryItemFormDialog,
  InventoryItemCard,
  InventoryFilter,
  InventoryEmptyState,
} from '../components/inventory';
import { useTranslation } from '../lib/i18n';

export function Inventory()
{
  const { t } = useTranslation();
  const {
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
  } = useInventoryPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('inventory.title')}</h2>
          <p className="text-gray-600 mt-1">{t('inventory.itemCount', { count: inventory.length })}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowScanner(true)} variant="outline" className="gap-2">
            <Scan className="w-4 h-4" />
            {t('inventory.scanBarcode')}
          </Button>
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            {t('inventory.addItem')}
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <InventoryEmptyState onAddClick={openAdd} />
      )}

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
