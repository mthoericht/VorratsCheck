import { Outlet, Link, useLocation } from 'react-router';
import { Refrigerator, LogOut, User, ChevronDown, Settings, Menu } from '@/app/lib/icons';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { NAV_ITEMS, getNavBreakpointClasses } from '../lib/layoutNav';
import { useLayout } from '../hooks/useLayout';
import { useTranslation } from '../lib/i18n';

export function Layout()
{
  const location = useLocation();
  const { t } = useTranslation();
  const {
    user,
    isNavOpen,
    setIsNavOpen,
    handleLogout,
  } = useLayout();
  const navBreakpoint = getNavBreakpointClasses();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <a href="#main-content" className="skip-to-main">
        {t('common.skipToContent')}
      </a>
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile: Burger-Menü */}
              <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(navBreakpoint.burgerButton, 'shrink-0')}
                    aria-label={t('nav.openMenu')}
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(85vw,20rem)] p-0 flex flex-col">
                  <SheetHeader className="border-b border-border px-4 py-3 text-left">
                    <SheetTitle className="text-lg">{t('nav.menu')}</SheetTitle>
                  </SheetHeader>
                  <nav
                    className="flex flex-col flex-1 overflow-y-auto py-2"
                    aria-label={t('nav.mainNavigation')}
                  >
                    {NAV_ITEMS.map((item) => 
                    {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsNavOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors',
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-r-2 border-emerald-600 dark:border-emerald-400'
                              : 'text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent'
                          )}
                        >
                          <Icon className="w-5 h-5 shrink-0" aria-hidden={true} />
                          {t(item.labelKey)}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="border-t border-border py-2">
                    <Link
                      to="/settings"
                      onClick={() => setIsNavOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent"
                    >
                      <Settings className="w-5 h-5 shrink-0" aria-hidden={true} />
                      {t('nav.settings')}
                    </Link>
                    <button
                      onClick={() => 
                      {
                        setIsNavOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="w-5 h-5 shrink-0" aria-hidden={true} />
                      {t('nav.logout')}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
              <Refrigerator className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden={true} />
              <span className="text-2xl font-bold text-gray-900 dark:text-foreground truncate">VorratsCheck</span>
            </div>

            {/* User menu (Radix: keyboard, focus trap, aria-expanded) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 dark:text-foreground dark:hover:bg-accent dark:hover:text-foreground data-[state=open]:[&_svg:last-child]:rotate-180"
                  aria-label={t('nav.userMenu')}
                >
                  <User className="w-5 h-5" aria-hidden={true} />
                  <span className="hidden sm:inline">{user?.username}</span>
                  <ChevronDown className="w-4 h-4 shrink-0 transition-transform" aria-hidden={true} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => handleLogout()}
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation (nur Desktop) */}
      <nav
        className={cn(navBreakpoint.desktopNav, 'border-b border-gray-200 dark:border-border bg-white dark:bg-card')}
        aria-label={t('nav.mainNavigation')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            {NAV_ITEMS.map((item) => 
            {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-3 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:border-gray-300 dark:hover:border-border'
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden={true} />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-foreground outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        <Outlet />
      </main>
    </div>
  );
}