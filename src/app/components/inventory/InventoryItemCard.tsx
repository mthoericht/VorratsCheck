import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pencil, Trash2, AlertTriangle, MapPin } from '@/app/lib/icons';
import { getExpiryStatus, INVENTORY_LOCATIONS } from '../../lib/inventory';
import { useTranslation } from '../../lib/i18n';
import type { InventoryItem } from '../../stores/inventoryStore';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAppPalette } from '../../lib/muiTheme';

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function InventoryItemCard({ item, onEdit, onDelete }: InventoryItemCardProps)
{
  const { t, formatDate } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const expiryStatus = getExpiryStatus(item.expiryDate);
  const expiryLabel = expiryStatus
    ? expiryStatus.status === 'expired'
      ? t('inventory.expired')
      : t('inventory.daysLeft', { days: expiryStatus.daysUntilExpiry })
    : '';
  const locationId = INVENTORY_LOCATIONS.find(l => l.value === item.location)?.id;
  const locationLabel = locationId ? t(`inventory.locations.${locationId}`) : item.location;
  const cardPalette = expiryStatus?.status === 'expired'
    ? appPalette.danger
    : expiryStatus?.status === 'warning'
      ? appPalette.warning
      : appPalette.info;

  return (
    <Card
      className="relative"
      sx={{
        borderColor: cardPalette.border,
        backgroundColor: cardPalette.bg,
      }}
    >
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.brand || item.category}</CardDescription>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="text-gray-600 hover:text-gray-900"
              title={t('common.edit')}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id, item.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Box>
        </Box>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">{t('inventory.quantityDisplay')}</Typography>
            <Typography sx={{ fontWeight: 600 }}>{item.quantity} {item.unit}</Typography>
          </Box>

          {item.expiryDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('inventory.bestBefore')} {formatDate(item.expiryDate)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {expiryStatus?.status === 'expired' && (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                {expiryStatus?.status === 'warning' && (
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                )}
                <Badge variant={expiryStatus?.variant}>
                  {expiryLabel}
                </Badge>
              </Box>
            </Box>
          )}

          {item.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <MapPin className="w-4 h-4" />
              <Typography variant="body2" color="text.secondary">{locationLabel}</Typography>
            </Box>
          )}

          {item.barcode && (
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }} color="text.secondary">
              {t('inventory.barcodePrefix')} {item.barcode}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
