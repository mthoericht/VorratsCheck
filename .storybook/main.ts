import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../test/storybook/stories/**/*.mdx', '../test/storybook/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) 
  {
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@shared': path.resolve(__dirname, '../shared'),
        },
      },
      plugins: [tailwindcss()],
    });
  },
};

export default config;
