import { Link, Outlet, useLocation } from 'react-router';
import { cn } from '../components/ui/utils';
import { FolderOpen, Globe, Palette } from '@/app/lib/icons';
import { useTranslation } from '../lib/i18n';

export function Settings() 
{
  const { t } = useTranslation();
  const location = useLocation();

  const settingsNavItems = [
    { path: '/settings/categories', label: t('settings.categories'), icon: FolderOpen },
    { path: '/settings/appearance', label: t('settings.appearance'), icon: Palette },
    { path: '/settings/language', label: t('settings.languageTitle'), icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('settings.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <nav className="border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {settingsNavItems.map((item) => 
          {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
