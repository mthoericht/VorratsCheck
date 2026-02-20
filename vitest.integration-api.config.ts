import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest config for API integration tests that hit the real server and test database.
 * Run with: npm run test:integration:api (sets DATABASE_URL=file:./data/test.db)
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts', './test/integration/api/setup-db.ts', './test/integration/api/setup-server.ts'],
    include: ['test/integration/api/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
