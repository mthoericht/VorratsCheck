import { createTheme, type PaletteMode, type Theme, type ThemeOptions } from '@mui/material/styles';

export type AppTone = 'neutral' | 'danger' | 'warning' | 'success' | 'accent' | 'info';

export type AppTonePalette = {
  border: string;
  bg: string;
  text: string;
  value: string;
  icon: string;
};

declare module '@mui/material/styles' {
  interface Palette {
    app?: Record<AppTone, AppTonePalette>;
  }

  interface PaletteOptions {
    app?: Partial<Record<AppTone, AppTonePalette>>;
  }
}

const LIGHT_PALETTE = {
  backgroundDefault: '#ffffff',
  backgroundPaper: '#ffffff',
  textPrimary: '#171717',
  textSecondary: '#717182',
  primaryMain: '#030213',
  primaryContrast: '#ffffff',
  secondaryMain: '#ececf0',
  secondaryContrast: '#030213',
  errorMain: '#d4183d',
  errorContrast: '#ffffff',
  divider: 'rgba(0,0,0,0.1)',
};

const DARK_PALETTE = {
  backgroundDefault: '#171717',
  backgroundPaper: '#171717',
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  primaryMain: '#f5f5f5',
  primaryContrast: '#171717',
  secondaryMain: '#3b3b3b',
  secondaryContrast: '#f5f5f5',
  errorMain: '#b8364f',
  errorContrast: '#ffffff',
  divider: '#3b3b3b',
};

const APP_TONE_PALETTES_LIGHT: Record<AppTone, AppTonePalette> = {
  neutral: {
    border: 'divider',
    bg: 'background.paper',
    text: 'text.primary',
    value: 'text.primary',
    icon: '#4b5563',
  },
  danger: {
    border: '#fecaca',
    bg: '#fef2f2',
    text: '#991b1b',
    value: '#dc2626',
    icon: '#dc2626',
  },
  warning: {
    border: '#fcd34d',
    bg: '#fffbeb',
    text: '#92400e',
    value: '#ca8a04',
    icon: '#d97706',
  },
  success: {
    border: '#86efac',
    bg: '#f0fdf4',
    text: '#166534',
    value: '#16a34a',
    icon: '#16a34a',
  },
  accent: {
    border: '#fbcfe8',
    bg: '#fdf2f8',
    text: '#9d174d',
    value: '#db2777',
    icon: '#db2777',
  },
  info: {
    border: '#bfdbfe',
    bg: '#eff6ff',
    text: '#1e3a8a',
    value: '#2563eb',
    icon: '#2563eb',
  },
};

/** Dark mode: translucent tints on dark paper — avoids “washed out pastel” cards */
const APP_TONE_PALETTES_DARK: Record<AppTone, AppTonePalette> = {
  neutral: {
    border: 'divider',
    bg: 'background.paper',
    text: 'text.primary',
    value: 'text.primary',
    icon: '#9ca3af',
  },
  danger: {
    border: 'rgba(248, 113, 113, 0.55)',
    bg: 'rgba(248, 113, 113, 0.12)',
    text: '#fecaca',
    value: '#fca5a5',
    icon: '#f87171',
  },
  warning: {
    border: 'rgba(251, 191, 36, 0.55)',
    bg: 'rgba(251, 191, 36, 0.12)',
    text: '#fde68a',
    value: '#fbbf24',
    icon: '#fbbf24',
  },
  success: {
    border: 'rgba(74, 222, 128, 0.5)',
    bg: 'rgba(74, 222, 128, 0.12)',
    text: '#bbf7d0',
    value: '#86efac',
    icon: '#4ade80',
  },
  accent: {
    border: 'rgba(244, 114, 182, 0.55)',
    bg: 'rgba(244, 114, 182, 0.12)',
    text: '#fbcfe8',
    value: '#f9a8d4',
    icon: '#f472b6',
  },
  info: {
    border: 'rgba(96, 165, 250, 0.55)',
    bg: 'rgba(96, 165, 250, 0.12)',
    text: '#bfdbfe',
    value: '#93c5fd',
    icon: '#60a5fa',
  },
};

function appTonePalettesForMode(mode: PaletteMode): Record<AppTone, AppTonePalette>
{
  return mode === 'dark' ? APP_TONE_PALETTES_DARK : APP_TONE_PALETTES_LIGHT;
}

function buildThemeOptions(mode: PaletteMode): ThemeOptions
{
  const paletteTokens = mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  return {
    palette: {
      mode,
      background: {
        default: paletteTokens.backgroundDefault,
        paper: paletteTokens.backgroundPaper,
      },
      text: {
        primary: paletteTokens.textPrimary,
        secondary: paletteTokens.textSecondary,
      },
      primary: {
        main: paletteTokens.primaryMain,
        contrastText: paletteTokens.primaryContrast,
      },
      secondary: {
        main: paletteTokens.secondaryMain,
        contrastText: paletteTokens.secondaryContrast,
      },
      error: {
        main: paletteTokens.errorMain,
        contrastText: paletteTokens.errorContrast,
      },
      divider: paletteTokens.divider,
      app: appTonePalettesForMode(mode),
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  };
}

export function createAppMuiTheme(mode: PaletteMode)
{
  return createTheme(buildThemeOptions(mode));
}

export function getAppPalette(theme: Theme): Record<AppTone, AppTonePalette>
{
  return theme.palette.app ?? appTonePalettesForMode(theme.palette.mode);
}
