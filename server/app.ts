/**
 * Express app for VorratsCheck API.
 * Import this in tests (e.g. with supertest); server/index.ts uses it and calls listen().
 */
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve relative file: URLs to absolute path (project root = parent of server/) so DB works regardless of cwd
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

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth.js';
import { inventoryRouter } from './routes/inventory.js';
import { mustHaveRouter } from './routes/mustHave.js';
import { wishlistRouter } from './routes/wishlist.js';
import { recipesRouter } from './routes/recipes.js';
import { dealsRouter } from './routes/deals.js';
import { categoriesRouter } from './routes/categories.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.VITE_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen, bitte versuchen Sie es später erneut' },
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/must-have', mustHaveRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/categories', categoriesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
