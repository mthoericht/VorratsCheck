import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit, Trash2, AlertCircle, CheckCircle } from '@/app/lib/icons';
import type { MustHaveItem } from '../../stores/mustHaveStore';
import { useTranslation } from '../../lib/i18n';
import { getAppPalette } from '../../lib/muiTheme';

export interface MustHaveStockStatus {
  current: number;
  needed: number;
  displayCurrent: number;
  displayNeeded: number;
  displayUnit: string;
  isLow: boolean;
}

interface MustHaveCardProps {
  item: MustHaveItem;
  status: MustHaveStockStatus;
  onEdit: (item: MustHaveItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function MustHaveCard({ item, status, onEdit, onDelete }: MustHaveCardProps) 
{
  const { t, currentLocale } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const cardPalette = status.isLow ? appPalette.danger : appPalette.success;
  return (
    <Card
      className="flex flex-col h-full"
      sx={{
        borderColor: cardPalette.border,
        backgroundColor: cardPalette.bg,
      }}
    >
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {status.isLow ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {item.name}
              </Box>
            </CardTitle>
            <CardDescription>
              {item.category && <span className="text-muted-foreground">{item.category}</span>}
              {item.category && ' · '}
              {status.isLow ? t('mustHave.restockRequired') : t('mustHave.sufficientStock')}
            </CardDescription>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, alignSelf: 'flex-start' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
              title={t('common.edit')}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id, item.name)}
              className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 w-8 p-0"
              title={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Box>
        </Box>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">{t('mustHave.currentStock')}</Typography>
            <Badge variant={status.isLow ? 'destructive' : 'default'}>
              {Number(status.displayCurrent).toLocaleString('de-DE', { maximumFractionDigits: 1 })} / {Number(status.displayNeeded).toLocaleString('de-DE', { maximumFractionDigits: 1 })}{status.displayUnit ? ` ${status.displayUnit}` : ''}
            </Badge>
          </Box>
          {status.isLow && (
            <Typography variant="body2" sx={{ color: cardPalette.value, fontWeight: 600 }}>
              {t('mustHave.stillNeeded', {
                amount: `${Math.max(0, Number(status.displayNeeded) - Number(status.displayCurrent)).toLocaleString(currentLocale === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })}${status.displayUnit ? ` ${status.displayUnit}` : ''}`
              })}
            </Typography>
          )}
          <Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (status.current / status.needed) * 100)}
              color={status.isLow ? 'error' : 'success'}
              aria-label={t('mustHave.currentStock')}
              sx={{ height: 8, borderRadius: 999 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
