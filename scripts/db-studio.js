/**
 * Runs Prisma Studio with DATABASE_URL set to the data/ directory
 * (project-root/data/dev.db) so Studio always opens the same DB file.
 */
import 'dotenv/config';
import path from 'path';
import { spawn } from 'child_process';

const dbPath = path.resolve(process.cwd(), 'data', 'dev.db');
const url = `file:${dbPath}`;

const child = spawn('npx', ['prisma', 'studio'], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: url },
});

child.on('exit', (code) =>
{
  process.exit(code ?? 0);
});

