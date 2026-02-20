import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts', './.storybook/vitest.setup.ts'],
    include: [
      'test/unit/**/*.{test,spec}.{ts,tsx}',
      'test/integration/**/*.{test,spec}.{ts,tsx}',
      'test/storybook/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'test/integration/api/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/app/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.*',
        '**/*.test.*',
        '**/*.spec.*',
        'test/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
