import { useState, useMemo } from 'react';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useDealsStore } from '../stores/dealsStore';
import type { Deal } from '../stores/dealsStore';

export type DealsFilterType = 'all' | 'mustHave' | 'wishList';

/**
 * Hook for the Deals page: filter state, filtered deals, match counts, and helpers.
 * Wishlist match: deal product or category contains wish name; or (if wish has category)
 * deal category contains wish category and also contains wish name.
 */
export function useDealsPage() 
{
  const mustHaveList = useMustHaveStore(s => s.items);
  const wishList = useWishlistStore(s => s.items);
  const dealsFromApi = useDealsStore(s => s.items);

  const [filterType, setFilterType] = useState<DealsFilterType>('all');

  const isWishListDeal = useMemo(
    () =>
      (deal: Deal) =>
        wishList.some(
          wish =>
            deal.product.toLowerCase().includes(wish.name.toLowerCase()) ||
            deal.name.toLowerCase().includes(wish.name.toLowerCase()) ||
            (wish.category !== undefined &&
              wish.category !== '' &&
              deal.name.toLowerCase().includes(wish.category.toLowerCase()) &&
              deal.name.toLowerCase().includes(wish.name.toLowerCase()))
        ),
    [wishList]
  );

  const isMustHaveDeal = useMemo(
    () =>
      (deal: Deal) =>
        mustHaveList.some(mustHave =>
          deal.product.toLowerCase().includes(mustHave.name.toLowerCase())
        ),
    [mustHaveList]
  );

  const mustHaveDealsCount = useMemo(
    () => dealsFromApi.filter(deal => isMustHaveDeal(deal)).length,
    [dealsFromApi, isMustHaveDeal]
  );

  const wishListDealsCount = useMemo(
    () => dealsFromApi.filter(deal => isWishListDeal(deal)).length,
    [dealsFromApi, isWishListDeal]
  );

  const deals = useMemo(() =>
  {
    if (filterType === 'all') return dealsFromApi;
    if (filterType === 'mustHave') return dealsFromApi.filter(deal => isMustHaveDeal(deal));
    if (filterType === 'wishList') return dealsFromApi.filter(deal => isWishListDeal(deal));
    return dealsFromApi;
  }, [dealsFromApi, filterType, isMustHaveDeal, isWishListDeal]);

  const avgDiscount = useMemo(
    () =>
      dealsFromApi.length
        ? Math.round(
          dealsFromApi.reduce((sum, deal) => sum + deal.discount, 0) / dealsFromApi.length
        )
        : 0,
    [dealsFromApi]
  );

  return {
    dealsFromApi,
    deals,
    filterType,
    setFilterType,
    mustHaveDealsCount,
    wishListDealsCount,
    avgDiscount,
    isMustHaveDeal,
    isWishListDeal,
  };
}
