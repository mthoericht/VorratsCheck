import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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

  return (
    <Card className="relative overflow-hidden flex flex-col h-full">
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-red-600 text-white text-lg px-3 py-1">
          -{deal.discount}%
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-lg pr-20">{deal.product}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          {deal.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 min-h-0 space-y-3 pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 line-through">
                €{deal.originalPrice.toFixed(2)}
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                €{deal.discountPrice.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{t('deals.savings')}</div>
              <div className="font-bold text-red-600">
                €{(deal.originalPrice - deal.discountPrice).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{deal.store}</span>
            <MapPin className="w-4 h-4 text-gray-600 ml-auto" />
            <span className="text-gray-600">{deal.distance} km</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('deals.validUntil')}</span>
            <span className="font-medium">{formatDate(deal.validUntil)}</span>
          </div>

          <div className="flex gap-2">
            {isMustHave && (
              <Badge variant="outline" className="border-emerald-600 text-emerald-600 flex-1 justify-center">
                {t('deals.mustHave')}
              </Badge>
            )}
            {isWishList && (
              <Badge variant="outline" className="border-pink-600 text-pink-600 flex-1 justify-center">
                {t('deals.wishlist')}
              </Badge>
            )}
          </div>

          {deal.inStock === false && (
            <div className="text-sm text-orange-600 font-medium">
              ⚠️ {t('deals.outOfStock')}
            </div>
          )}
        </div>

        <Button className="w-full gap-2 mt-auto">
          <ShoppingCart className="w-4 h-4" />
          {t('deals.goToDeal')}
        </Button>
      </CardContent>
    </Card>
  );
}
