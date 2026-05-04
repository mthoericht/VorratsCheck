import { Button } from '../components/ui/button';
import { Box, Stack, Typography } from '@mui/material';
import { Plus } from '@/app/lib/icons';
import { getStockStatus } from '../lib/mustHave';
import { useTranslation } from '../lib/i18n';
import {
  MustHaveCard,
  MustHaveEmptyState,
  MustHaveItemDialog,
  MustHaveStats,
} from '../components/mustHave';
import { useMustHavePage } from '../hooks/useMustHavePage';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function MustHaveList()
{
  const { t } = useTranslation();
  const {
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
  } = useMustHavePage();

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
            {t('mustHave.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('mustHave.subtitle')}
          </Typography>
        </Box>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          {t('mustHave.addItem')}
        </Button>
      </Box>

      <StoreErrorAlert error={mustHaveError} />

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
        {mustHaveList.map(item => (
          <MustHaveCard
            key={item.id}
            item={item}
            status={getStockStatus(item, inventory)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </Box>

      {mustHaveList.length === 0 && <MustHaveEmptyState onAddClick={openAdd} />}
    </Stack>
  );
}
