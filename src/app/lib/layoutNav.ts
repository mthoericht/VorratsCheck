import {
  type LucideIcon,
  Refrigerator,
  ListChecks,
  Heart,
  Tag,
  ChefHat,
  LayoutDashboard,
} from '@/app/lib/icons';

export interface NavItem {
  path: string;
  icon: LucideIcon;
  /** i18n key (e.g. 'nav.dashboard') – translated by the component via t(). */
  labelKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/inventory', icon: Refrigerator, labelKey: 'nav.inventory' },
  { path: '/must-have', icon: ListChecks, labelKey: 'nav.mustHave' },
  { path: '/wishlist', icon: Heart, labelKey: 'nav.wishlist' },
  { path: '/recipes', icon: ChefHat, labelKey: 'nav.recipes' },
  { path: '/deals', icon: Tag, labelKey: 'nav.deals' },
];
