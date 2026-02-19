/**
 * Express app for VorratsCheck API.
 * Import this in tests (e.g. with supertest); server/index.ts uses it and calls listen().
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { inventoryRouter } from './routes/inventory.js';
import { mustHaveRouter } from './routes/mustHave.js';
import { wishlistRouter } from './routes/wishlist.js';
import { recipesRouter } from './routes/recipes.js';
import { dealsRouter } from './routes/deals.js';
import { categoriesRouter } from './routes/categories.js';

export const app = express();

app.use(cors({ origin: process.env.VITE_ORIGIN ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/must-have', mustHaveRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/categories', categoriesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
