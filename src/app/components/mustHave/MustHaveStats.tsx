import { useTranslation } from '../../lib/i18n';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Card } from '../ui/card';
import { getAppPalette } from '../../lib/muiTheme';

interface MustHaveStatsProps {
  totalCount: number;
  sufficientCount: number;
  lowCount: number;
}

export function MustHaveStats({ totalCount, sufficientCount, lowCount }: MustHaveStatsProps) 
{
  const { t } = useTranslation();
  const theme = useTheme();
  const appPalette = getAppPalette(theme);
  const successPalette = appPalette.success;
  const dangerPalette = appPalette.danger;
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, minmax(0, 1fr))',
        },
      }}
    >
      <Card>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {t('mustHave.totalItems')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700 }}>
            {totalCount}
          </Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: successPalette.border, backgroundColor: successPalette.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: successPalette.text }}>
            {t('mustHave.sufficient')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: successPalette.value }}>
            {sufficientCount}
          </Typography>
        </Box>
      </Card>
      <Card sx={{ borderColor: dangerPalette.border, backgroundColor: dangerPalette.bg }}>
        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: dangerPalette.text }}>
            {t('mustHave.restock')}
          </Typography>
          <Typography component="div" variant="h4" sx={{ fontWeight: 700, color: dangerPalette.value }}>
            {lowCount}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
