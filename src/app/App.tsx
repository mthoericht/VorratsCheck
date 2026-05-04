import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './stores/authStore';
import { useSettingsStore, type Locale } from './stores/settingsStore';
import { useInventoryStore } from './stores/inventoryStore';
import { useMustHaveStore } from './stores/mustHaveStore';
import { useWishlistStore } from './stores/wishlistStore';
import { useRecipesStore } from './stores/recipesStore';
import { useDealsStore } from './stores/dealsStore';
import { useCategoriesStore } from './stores/categoriesStore';
import { router } from './routes';
import { MuiThemeBridge } from './components/MuiThemeBridge';

const HTML_LANG: Record<Locale, string> = { de: 'de', en: 'en' };

/** Keeps document language in sync with app locale (screen readers, hyphenation). */
function SyncDocumentLangFromStore()
{
  const locale = useSettingsStore((s) => s.locale);
  useEffect(() =>
  {
    document.documentElement.lang = HTML_LANG[locale] ?? 'de';
  }, [locale]);
  return null;
}

/** Syncs theme preference from settingsStore to next-themes (store is source of truth). */
function SyncThemeFromStore()
{
  const theme = useSettingsStore((s) => s.theme);
  const { setTheme } = useTheme();
  useEffect(() =>
  {
    setTheme(theme);
  }, [theme, setTheme]);
  return null;
}

function DataLoader() 
{
  const user = useAuthStore((s) => s.user);
  useEffect(() => 
  {
    if (!user) return;
    useInventoryStore.getState().fetch();
    useMustHaveStore.getState().fetch();
    useWishlistStore.getState().fetch();
    useCategoriesStore.getState().fetch();
    useRecipesStore.getState().fetch();
    useDealsStore.getState().fetch();
  }, [user]);
  return null;
}

function App() 
{
  const setLoading = useAuthStore((s) => s.setLoading);
  useEffect(() => 
  {
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      <SyncDocumentLangFromStore />
      <SyncThemeFromStore />
      <DataLoader />
      <MuiThemeBridge>
        <RouterProvider router={router} />
        <Toaster />
      </MuiThemeBridge>
    </>
  );
}

export default App;
