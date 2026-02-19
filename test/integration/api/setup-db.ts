/**
 * Setup for API integration tests: use test database and push schema.
 * DATABASE_URL should be set to file:./data/test.db (e.g. via test:integration:api script).
 */
import { execSync } from 'child_process';
import path from 'path';

const testDbPath = path.resolve(process.cwd(), 'data/test.db');
process.env.DATABASE_URL = process.env.DATABASE_URL || `file:${testDbPath}`;

execSync('npx prisma db push', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});
