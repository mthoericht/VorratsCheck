import { useMemo, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from 'next-themes';
import { createAppMuiTheme } from '@/app/lib/muiTheme';

type MuiThemeBridgeProps = {
  children: ReactNode;
};

export function MuiThemeBridge({ children }: MuiThemeBridgeProps)
{
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';

  const theme = useMemo(() => createAppMuiTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
