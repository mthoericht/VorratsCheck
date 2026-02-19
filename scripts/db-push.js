/**
 * Runs prisma db push with DATABASE_URL set to the data/ directory
 * (project-root/data/dev.db) so the DB file is created in data/ and matches
 * what the app uses when run from project root with file:./data/dev.db.
 */
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'dev.db');
const url = `file:${dbPath}`;

execSync('npx prisma db push', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: url },
});
