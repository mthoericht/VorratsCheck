import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { useSettingsStore } from '../src/app/stores/settingsStore';
import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'UI language',
      defaultValue: 'de',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'de', title: 'Deutsch' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Pages',
          ['Dashboard', 'Inventory', 'MustHaveList', 'WishList', 'Deals', 'Recipes', 'Settings', 'Login', 'Signup'],
          'Components',
          [
            'Dashboard',
            'Inventory',
            'MustHave',
            'Wishlist',
            'Deals',
            'Recipe',
            'settings',
            'BarcodeScanner',
            'Layout',
            'Quantity',
            'RouteErrorBoundary',
          ],
          'UI',
        ],
      },
    },
  },
  decorators: [
    (Story, context) =>
    {
      const locale = (context.parameters.locale as 'de' | 'en' | undefined) ?? (context.globals?.locale as 'de' | 'en') ?? 'de';
      useSettingsStore.getState().setLocale(locale);
      const initialEntries = context.parameters.router?.initialEntries as string[] | undefined;
      return (
        <MemoryRouter initialEntries={initialEntries}>
          <ThemeProvider attribute="class" defaultTheme="light" storageKey="vorratscheck-theme" enableSystem>
            <div className="min-h-[200px] p-4" role="region" aria-label="Story preview">
              <Story />
            </div>
          </ThemeProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
