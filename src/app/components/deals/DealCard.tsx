import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Box, Typography } from '@mui/material';
import { MapPin, Tag, ShoppingCart } from '@/app/lib/icons';
import type { Deal } from '../../stores/dealsStore';
import { useTranslation } from '../../lib/i18n';

interface DealCardProps {
  deal: Deal;
  isMustHave: boolean;
  isWishList: boolean;
}

export function DealCard({ deal, isMustHave, isWishList }: DealCardProps) 
{
  const { t, formatDate } = useTranslation();
  const savings = deal.originalPrice - deal.discountPrice;

  return (
    <Card className="relative overflow-hidden flex flex-col h-full">
      {/* Discount Badge */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Badge style={{ backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626', fontSize: 16, padding: '4px 12px' }}>
          -{deal.discount}%
        </Badge>
      </Box>

      <CardHeader>
        <CardTitle style={{ paddingRight: 80 }}>{deal.product}</CardTitle>
        <CardDescription>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Tag className="w-4 h-4" />
            {deal.name}
          </Box>
        </CardDescription>
      </CardHeader>

      <CardContent style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                €{deal.originalPrice.toFixed(2)}
              </Typography>
              <Typography component="div" variant="h5" sx={{ fontWeight: 700, color: '#059669' }}>
                €{deal.discountPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">{t('deals.savings')}</Typography>
              <Typography sx={{ fontWeight: 700, color: '#dc2626' }}>
                €{savings.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart className="w-4 h-4" style={{ color: '#6b7280' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{deal.store}</Typography>
            <MapPin className="w-4 h-4" style={{ color: '#6b7280', marginLeft: 'auto' }} />
            <Typography variant="body2" color="text.secondary">{deal.distance} km</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="span" variant="body2" color="text.secondary">{t('deals.validUntil')}</Typography>
            <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>{formatDate(deal.validUntil)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isMustHave && (
              <Badge variant="outline" style={{ borderColor: '#059669', color: '#059669', flex: 1, justifyContent: 'center' }}>
                {t('deals.mustHave')}
              </Badge>
            )}
            {isWishList && (
              <Badge variant="outline" style={{ borderColor: '#db2777', color: '#db2777', flex: 1, justifyContent: 'center' }}>
                {t('deals.wishlist')}
              </Badge>
            )}
          </Box>

          {deal.inStock === false && (
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ea580c' }}>
              ⚠️ {t('deals.outOfStock')}
            </Typography>
          )}
        </Box>

        <Button sx={{ width: '100%', gap: 1, mt: 'auto' }}>
          <ShoppingCart className="w-4 h-4" />
          {t('deals.goToDeal')}
        </Button>
      </CardContent>
    </Card>
  );
}
