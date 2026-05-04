import { type WishlistPriority } from './priorityUtils';
import { WishlistItemCard } from './WishlistItemCard';
import type { WishListItem } from '../../stores/wishlistStore';
import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAppPalette } from '../../lib/muiTheme';

interface WishlistPrioritySectionProps {
  priority: WishlistPriority;
  items: WishListItem[];
  onEdit: (item: WishListItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function WishlistPrioritySection({
  priority,
  items,
  onEdit,
  onDelete,
}: WishlistPrioritySectionProps) 
{
  const { t } = useTranslation();
  const theme = useTheme();
  if (items.length === 0) return null;
  const appPalette = getAppPalette(theme);
  const priorityPalette = priority === 'high'
    ? appPalette.danger
    : priority === 'medium'
      ? appPalette.warning
      : appPalette.success;

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: priorityPalette.border,
            borderRadius: 1,
            px: 1,
            py: 0.25,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.2,
            color: priorityPalette.text,
            backgroundColor: priorityPalette.bg,
          }}
        >
          {t(`priorities.${priority}`)}
        </Box>
        <Typography component="span" variant="body2" color="text.secondary">({items.length})</Typography>
      </Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </Box>
  );
}
