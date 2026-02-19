/**
 * Runs prisma db push with DATABASE_URL set to an absolute path
 * (project-root/data/dev.db) so the DB file is created in data/ and matches
 * what the app uses when run from project root with file:./data/dev.db.
 */
import 'dotenv/config';
import path from 'path';
import { execSync } from 'child_process';

const dbPath = path.resolve(process.cwd(), 'data', 'dev.db');
const url = `file:${dbPath}`;

execSync('npx prisma db push', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: url },
});
