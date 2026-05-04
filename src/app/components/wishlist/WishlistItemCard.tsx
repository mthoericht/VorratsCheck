import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, Edit, Trash2 } from '@/app/lib/icons';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { WishListItem } from '../../stores/wishlistStore';
import { useTranslation } from '../../lib/i18n';
import { getAppPalette } from '../../lib/muiTheme';

interface WishlistItemCardProps {
  item: WishListItem;
  onEdit: (item: WishListItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function WishlistItemCard({ item, onEdit, onDelete }: WishlistItemCardProps) 
{
  const { t } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const priorityPalette = item.priority === 'high'
    ? appPalette.danger
    : item.priority === 'medium'
      ? appPalette.warning
      : appPalette.success;

  return (
    <Card sx={{ borderColor: priorityPalette.border, backgroundColor: priorityPalette.bg }}>
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Heart className="w-5 h-5" style={{ color: priorityPalette.icon }} />
                {item.name}
              </Box>
            </CardTitle>
            {(item.category || item.brand) && (
              <CardDescription>
                {[item.category, item.brand].filter(Boolean).join(' · ')}
              </CardDescription>
            )}
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              title={t('common.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Box>
        </Box>
      </CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {item.category && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography component="span" variant="body2" color="text.secondary">{t('wishlist.categoryDisplay')}</Typography>
              <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>{item.category}</Typography>
            </Box>
          )}
          {item.brand && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography component="span" variant="body2" color="text.secondary">{t('wishlist.brandDisplay')}</Typography>
              <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>{item.brand}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
