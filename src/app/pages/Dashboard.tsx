import { useInventoryStore } from '../stores/inventoryStore';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { getStockStatus } from '../lib/mustHave';
import { useTranslation } from '../lib/i18n';
import { StatCard } from '../components/ui/stat-card';
import { ExpiredItemsCard, ExpiringSoonCard, LowStockCard, QuickActionsCard } from '../components/dashboard';
import { Clock, Refrigerator, Heart, TrendingDown } from '@/app/lib/icons';
import { StoreErrorAlert } from '../components/ui/store-error-alert';

export function Dashboard() 
{
  const { t } = useTranslation();
  const inventory = useInventoryStore((s) => s.items);
  const inventoryError = useInventoryStore((s) => s.error);
  const mustHaveList = useMustHaveStore((s) => s.items);
  const wishList = useWishlistStore((s) => s.items);

  // Calculate expiring soon items (within 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const expiringSoon = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= sevenDaysFromNow && expiryDate >= today;
  });

  const expired = inventory.filter(item => 
  {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate < today;
  });

  // Low stock: same unit-aware logic as Must-Have list (weight→g, volume→ml, countable→same unit)
  const lowStockItems = mustHaveList.filter((mustHave) =>
    getStockStatus(mustHave, inventory).isLow
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h2>
        <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <StoreErrorAlert error={inventoryError} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('dashboard.totalItems')}
          value={inventory.length}
          subtitle={t('dashboard.inStock')}
          icon={<Refrigerator className="w-4 h-4 text-gray-600" />}
        />
        <StatCard
          title={t('dashboard.expiringSoon')}
          value={expiringSoon.length}
          subtitle={t('dashboard.next7Days')}
          icon={<Clock className="w-4 h-4 text-orange-600" />}
          valueClassName="text-2xl font-bold text-orange-600"
        />
        <StatCard
          title={t('dashboard.lowStock')}
          value={lowStockItems.length}
          subtitle={t('dashboard.restock')}
          icon={<TrendingDown className="w-4 h-4 text-red-600" />}
          valueClassName="text-2xl font-bold text-red-600"
        />
        <StatCard
          title={t('dashboard.wishlist')}
          value={wishList.length}
          subtitle={t('common.items')}
          icon={<Heart className="w-4 h-4 text-pink-600" />}
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiredItemsCard items={expired} />
        <ExpiringSoonCard items={expiringSoon} maxItems={5} />
        <LowStockCard items={lowStockItems} />
      </div>

      <QuickActionsCard />
    </div>
  );
}
