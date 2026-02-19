import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatCard } from '../components/ui/stat-card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Tag, ShoppingCart, TrendingDown } from 'lucide-react';
import { useDealsPage } from '../hooks/useDealsPage';

export function Deals()
{
  const {
    dealsFromApi,
    deals,
    filterType,
    setFilterType,
    mustHaveDealsCount,
    wishListDealsCount,
    avgDiscount,
    isMustHaveDeal,
    isWishListDeal,
  } = useDealsPage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Angebote</h2>
        <p className="text-gray-600 mt-1">Aktuelle Angebote in Ihrer Nähe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Alle Angebote" value={dealsFromApi.length} />
        <StatCard
          title="Must-Have Angebote"
          value={mustHaveDealsCount}
          className="border-emerald-200"
          titleClassName="text-sm font-medium text-emerald-800"
          valueClassName="text-2xl font-bold text-emerald-600"
        />
        <StatCard
          title="Wunschliste Angebote"
          value={wishListDealsCount}
          className="border-pink-200"
          titleClassName="text-sm font-medium text-pink-800"
          valueClassName="text-2xl font-bold text-pink-600"
        />
        <StatCard
          title="Durchschnitt Ersparnis"
          value={dealsFromApi.length ? `${avgDiscount}%` : '0%'}
          className="border-blue-200"
          titleClassName="text-sm font-medium text-blue-800"
          valueClassName="text-2xl font-bold text-blue-600"
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Alle Angebote
        </Button>
        <Button
          variant={filterType === 'mustHave' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('mustHave')}
          className="gap-2"
        >
          Must-Have
          {mustHaveDealsCount > 0 && (
            <Badge variant="secondary" className="ml-1">{mustHaveDealsCount}</Badge>
          )}
        </Button>
        <Button
          variant={filterType === 'wishList' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('wishList')}
          className="gap-2"
        >
          Wunschliste
          {wishListDealsCount > 0 && (
            <Badge variant="secondary" className="ml-1">{wishListDealsCount}</Badge>
          )}
        </Button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map(deal =>
        {
          const isMustHave = isMustHaveDeal(deal);
          const isWishList = isWishListDeal(deal);

          return (
            <Card key={deal.id} className="relative overflow-hidden">
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

              <CardContent className="space-y-3">
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
                    <div className="text-sm text-gray-500">Ersparnis</div>
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
                  <span className="text-gray-600">Gültig bis:</span>
                  <span className="font-medium">{new Date(deal.validUntil).toLocaleDateString('de-DE')}</span>
                </div>

                <div className="flex gap-2">
                  {isMustHave && (
                    <Badge variant="outline" className="border-emerald-600 text-emerald-600 flex-1 justify-center">
                      Must-Have
                    </Badge>
                  )}
                  {isWishList && (
                    <Badge variant="outline" className="border-pink-600 text-pink-600 flex-1 justify-center">
                      Wunschliste
                    </Badge>
                  )}
                </div>

                {deal.inStock === false && (
                  <div className="text-sm text-orange-600 font-medium">
                    ⚠️ Möglicherweise nicht auf Lager
                  </div>
                )}

                <Button className="w-full gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Zum Angebot
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {deals.length === 0 && (
        <Card className="p-12 text-center">
          <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Keine passenden Angebote gefunden</p>
          <p className="text-sm text-gray-400 mt-2">
            Versuchen Sie, Artikel zu Ihrer Must-Have oder Wunschliste hinzuzufügen
          </p>
        </Card>
      )}
    </div>
  );
}
