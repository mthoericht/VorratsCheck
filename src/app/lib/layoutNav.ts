import type { LucideIcon } from 'lucide-react';
import {
  Package,
  ListChecks,
  Heart,
  Tag,
  ChefHat,
  LayoutDashboard,
} from 'lucide-react';

export interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

export type LayoutNavBreakpoint = 'sm' | 'md' | 'lg';

/**
 * Viewport breakpoint from which the desktop navigation is shown.
 * Below: burger menu. From this breakpoint: horizontal desktop nav.
 *
 * Tailwind breakpoints: sm = 640px, md = 768px, lg = 1024px
 */
export const LAYOUT_NAV_BREAKPOINT: LayoutNavBreakpoint = 'md';

/** Classes per breakpoint: burger button (visible below), desktop nav (visible from breakpoint). */
const NAV_CLASSES: Record<LayoutNavBreakpoint, { burgerButton: string; desktopNav: string }> = 
{
  sm: { burgerButton: 'sm:hidden', desktopNav: 'hidden sm:block' },
  md: { burgerButton: 'md:hidden', desktopNav: 'hidden md:block' },
  lg: { burgerButton: 'lg:hidden', desktopNav: 'hidden lg:block' },
};

export function getNavBreakpointClasses(): { burgerButton: string; desktopNav: string }
{
  return NAV_CLASSES[LAYOUT_NAV_BREAKPOINT];
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/inventory', icon: Package, label: 'Vorrat' },
  { path: '/must-have', icon: ListChecks, label: 'Must-Have' },
  { path: '/wishlist', icon: Heart, label: 'Wunschliste' },
  { path: '/recipes', icon: ChefHat, label: 'Rezepte' },
  { path: '/deals', icon: Tag, label: 'Angebote' },
];
