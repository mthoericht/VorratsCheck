/**
 * Resolves DATABASE_URL to an absolute path when it is a relative file: URL.
 * Seed scripts run with cwd that may differ from project root; this ensures the DB file is found.
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

if (!process.env.DATABASE_URL)
{
  process.env.DATABASE_URL = `file:${path.join(projectRoot, 'data', 'dev.db')}`;
}
else if (process.env.DATABASE_URL.startsWith('file:./'))
{
  const relative = process.env.DATABASE_URL.replace(/^file:/, '');
  process.env.DATABASE_URL = `file:${path.join(projectRoot, relative)}`;
}
