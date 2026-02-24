import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { getStockStatus } from '../lib/mustHave';
import { useTranslation } from '../lib/i18n';
import {
  MustHaveCard,
  MustHaveEmptyState,
  MustHaveItemDialog,
  MustHaveStats,
} from '../components/mustHave';
import { useMustHavePage } from '../hooks/useMustHavePage';

export function MustHaveList()
{
  const { t } = useTranslation();
  const {
    mustHaveList,
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
  } = useMustHavePage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t('mustHave.title')}</h2>
          <p className="text-gray-600 mt-1">{t('mustHave.subtitle')}</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          {t('mustHave.addItem')}
        </Button>
      </div>

      <MustHaveItemDialog
        open={showAddDialog}
        onOpenChange={handleCloseDialog}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        onSubmit={handleSubmit}
        categories={categories}
      />

      <MustHaveStats
        totalCount={mustHaveList.length}
        sufficientCount={sufficientCount}
        lowCount={lowCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mustHaveList.map(item => (
          <MustHaveCard
            key={item.id}
            item={item}
            status={getStockStatus(item, inventory)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {mustHaveList.length === 0 && <MustHaveEmptyState onAddClick={openAdd} />}
    </div>
  );
}
