import { Link, Outlet, useLocation } from 'react-router';
import { FolderOpen, Globe, Palette } from '@/app/lib/icons';
import { useTranslation } from '../lib/i18n';
import { Box, Link as MuiLink, Typography } from '@mui/material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('settings.subtitle')}
        </Typography>
      </Box>

      <Box
        component="nav"
        aria-label={t('settings.subNavigation')}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mx: { xs: -2, sm: -3, lg: -4 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box sx={{ display: 'flex', gap: 3 }}>
          {settingsNavItems.map((item) => 
          {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <MuiLink
                key={item.path}
                component={Link}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                underline="none"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 0.25,
                  py: 1.5,
                  borderBottom: '2px solid',
                  borderBottomColor: isActive ? 'success.main' : 'transparent',
                  color: isActive ? 'success.main' : 'text.secondary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'color 150ms, border-color 150ms',
                  '&:hover': {
                    color: 'text.primary',
                    borderBottomColor: 'divider',
                  },
                }}
              >
                <Icon className="w-4 h-4" aria-hidden={true} />
                {item.label}
              </MuiLink>
            );
          })}
        </Box>
      </Box>

      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
