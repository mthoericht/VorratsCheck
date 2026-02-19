import { Outlet, Link, useLocation } from 'react-router';
import { 
  Package, 
  ListChecks, 
  Heart, 
  Tag, 
  ChefHat,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Settings
} from 'lucide-react';
import { cn } from './ui/utils';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import React, { useState } from 'react';

export function Layout() 
{
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Vorrat' },
    { path: '/must-have', icon: ListChecks, label: 'Must-Have' },
    { path: '/wishlist', icon: Heart, label: 'Wunschliste' },
    { path: '/recipes', icon: ChefHat, label: 'Rezepte' },
    { path: '/deals', icon: Tag, label: 'Angebote' },
  ];

  const handleLogout = () => 
  {
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">VorratsCheck</h1>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="gap-2 dark:text-foreground dark:hover:bg-accent dark:hover:text-foreground"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.username}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  isUserMenuOpen && "rotate-180"
                )} />
              </Button>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  
                  {/* Menu Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-card rounded-md shadow-lg border border-gray-200 dark:border-border z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-border">
                      <p className="font-medium text-gray-900 dark:text-foreground">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent w-full"
                      >
                        <Settings className="w-4 h-4" />
                        Einstellungen
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Abmelden
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-border bg-white dark:bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            {navItems.map((item) => 
            {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:border-gray-300 dark:hover:border-border'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-foreground">
        <Outlet />
      </main>
    </div>
  );
}