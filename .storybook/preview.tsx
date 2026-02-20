import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import { MemoryRouter } from 'react-router';
import React from 'react';
import '../src/styles/index.css';

const preview: Preview = {
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
      const initialEntries = context.parameters.router?.initialEntries as string[] | undefined;
      return (
        <MemoryRouter initialEntries={initialEntries}>
          <ThemeProvider attribute="class" defaultTheme="light" storageKey="vorratscheck-theme" enableSystem>
            <div className="min-h-[200px] p-4">
              <Story />
            </div>
          </ThemeProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
