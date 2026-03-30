import { useDealsPage } from '../hooks/useDealsPage';
import { DealsStats, DealsFilterBar, DealCard, DealsEmptyState } from '../components/deals';
import { useTranslation } from '../lib/i18n';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function Deals()
{
  const {
    dealsFromApi,
    dealsError,
    deals,
    filterType,
    setFilterType,
    mustHaveDealsCount,
    wishListDealsCount,
    avgDiscount,
    isMustHaveDeal,
    isWishListDeal,
  } = useDealsPage();

  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('deals.title')}</h1>
        <p className="text-gray-600 mt-1">{t('deals.subtitle')}</p>
      </div>

      <StoreErrorAlert error={dealsError} />

      <DealsStats
        totalCount={dealsFromApi.length}
        mustHaveCount={mustHaveDealsCount}
        wishListCount={wishListDealsCount}
        avgDiscount={avgDiscount}
      />

      <DealsFilterBar
        filterType={filterType}
        setFilterType={setFilterType}
        mustHaveCount={mustHaveDealsCount}
        wishListCount={wishListDealsCount}
      />

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map(deal => (
          <DealCard
            key={deal.id}
            deal={deal}
            isMustHave={isMustHaveDeal(deal)}
            isWishList={isWishListDeal(deal)}
          />
        ))}
      </div>

      {deals.length === 0 && <DealsEmptyState />}
    </div>
  );
}
