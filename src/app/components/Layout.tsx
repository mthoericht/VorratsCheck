import { Outlet, Link, useLocation } from 'react-router';
import { Refrigerator, LogOut, User, ChevronDown, Settings, Menu as MenuIcon } from '@/app/lib/icons';
import { NAV_ITEMS } from '../lib/layoutNav';
import { useLayout } from '../hooks/useLayout';
import { useTranslation } from '../lib/i18n';
import {
  AppBar,
  Box,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';

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
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const isUserMenuOpen = Boolean(userMenuAnchor);

  const openUserMenu = (event: MouseEvent<HTMLButtonElement>) =>
  {
    setUserMenuAnchor(event.currentTarget);
  };

  const closeUserMenu = () =>
  {
    setUserMenuAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <a href="#main-content" className="skip-to-main">
        {t('common.skipToContent')}
      </a>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Box sx={{ width: '100%', maxWidth: '80rem', mx: 'auto', px: { xs: 0, sm: 1, lg: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton
                  onClick={() => setIsNavOpen(true)}
                  aria-label={t('nav.openMenu')}
                  sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                >
                  <MenuIcon className="w-6 h-6" />
                </IconButton>
                <Refrigerator className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden={true} />
                <Typography variant="h5" component="span" noWrap sx={{ fontWeight: 700 }}>
                  VorratsCheck
                </Typography>
              </Box>

              <ButtonBase
                onClick={openUserMenu}
                aria-label={t('nav.userMenu')}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 1,
                  px: 1.25,
                  py: 0.75,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <User className="w-5 h-5" aria-hidden={true} />
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {user?.username}
                </Typography>
                <ChevronDown className="w-4 h-4 shrink-0" aria-hidden={true} />
              </ButtonBase>
            </Box>
          </Box>
        </Toolbar>
        <Box
          component="nav"
          aria-label={t('nav.mainNavigation')}
          sx={{ display: { xs: 'none', md: 'block' }, borderTop: 1, borderColor: 'divider' }}
        >
          <Box sx={{ width: '100%', maxWidth: '80rem', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto' }}>
              {NAV_ITEMS.map((item) =>
              {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <ButtonBase
                    key={item.path}
                    component={Link}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 1.5,
                      borderBottom: '2px solid',
                      borderBottomColor: isActive ? 'success.main' : 'transparent',
                      color: isActive ? 'success.main' : 'text.secondary',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'text.primary',
                        borderBottomColor: 'divider',
                      },
                    }}
                  >
                    <Icon className="w-5 h-5" aria-hidden={true} />
                    {t(item.labelKey)}
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Box>
      </AppBar>

      <Drawer anchor="left" open={isNavOpen} onClose={() => setIsNavOpen(false)}>
        <Box sx={{ width: 'min(85vw, 20rem)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">{t('nav.menu')}</Typography>
          </Box>
          <Box component="nav" aria-label={t('nav.mainNavigation')} sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
            {NAV_ITEMS.map((item) =>
            {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <ButtonBase
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => setIsNavOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRight: '2px solid',
                    borderRightColor: isActive ? 'success.main' : 'transparent',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    color: isActive ? 'success.main' : 'text.primary',
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden={true} />
                  <Typography variant="body1">{t(item.labelKey)}</Typography>
                </ButtonBase>
              );
            })}
          </Box>
          <Divider />
          <Box sx={{ py: 1 }}>
            <ButtonBase
              component={Link}
              to="/settings"
              onClick={() => setIsNavOpen(false)}
              sx={{ width: '100%', justifyContent: 'flex-start', gap: 1.5, px: 2, py: 1.5 }}
            >
              <Settings className="w-5 h-5 shrink-0" aria-hidden={true} />
              <Typography variant="body1">{t('nav.settings')}</Typography>
            </ButtonBase>
            <ButtonBase
              onClick={() =>
              {
                setIsNavOpen(false);
                handleLogout();
              }}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                gap: 1.5,
                px: 2,
                py: 1.5,
                color: 'error.main',
              }}
            >
              <LogOut className="w-5 h-5 shrink-0" aria-hidden={true} />
              <Typography variant="body1">{t('nav.logout')}</Typography>
            </ButtonBase>
          </Box>
        </Box>
      </Drawer>

      <MuiMenu
        anchorEl={userMenuAnchor}
        open={isUserMenuOpen}
        onClose={closeUserMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.username}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem
          component={Link}
          to="/settings"
          onClick={closeUserMenu}
          sx={{ gap: 1 }}
        >
          <Settings className="w-4 h-4" />
          {t('nav.settings')}
        </MenuItem>
        <MenuItem
          onClick={() =>
          {
            closeUserMenu();
            handleLogout();
          }}
          sx={{ gap: 1, color: 'error.main' }}
        >
          <LogOut className="w-4 h-4" />
          {t('nav.logout')}
        </MenuItem>
      </MuiMenu>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          width: '100%',
          maxWidth: '80rem',
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          py: 4,
          color: 'text.primary',
          outline: 'none',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}