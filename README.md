# VorratsCheck

Food storage management: inventory, wishlist, must-have list, recipes, deals, and **categories** — with Express backend, Prisma (SQLite), and Zustand.

## Features

- **Inventory** – Items with name, category (selectable), quantity, expiry date, location; barcode scanner
- **Must-Have** – Items that should always be in stock (matched by name, optional category)
- **Wishlist** – Entries by priority, with category selection
- **Recipes** – Recipes with ingredients, instructions, matched against inventory
- **Deals** – Deals filtered by must-have and wishlist
- **Categories** – Central category management; in inventory, must-have, and wishlist only selectable (no free text)

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind, Zustand
- **Backend:** Express, JWT auth
- **Database:** Prisma with SQLite

## Requirements

- Node.js 18+
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Create a `.env` file (e.g. copy from `.env.example`). If you already have a `.env`, update `DATABASE_URL` to use the `data/` folder.

   ```bash
   cp .env.example .env
   ```

   Main variables:

   - `DATABASE_URL` – e.g. `file:./data/dev.db`
   - `JWT_SECRET` – secret for JWT (use a strong value in production)
   - `INVITE_CODE` – invite code for registration (e.g. `VORRATSCHECK2026`)

   Optional:

   - `VITE_ORIGIN` – CORS origin (default: `http://localhost:5173`)
   - `PORT` – API server port (default: `3001`)
   - `VITE_API_URL` – API base URL for the frontend (only needed if frontend and API are on different origins, e.g. in production)

3. **Prisma**

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed-deals
   npm run db:seed-categories   # requires at least one user
   npm run db:seed-recipes       # requires at least one user
   ```

   Seeds live in `scripts/`. `db:seed-deals` creates initial deals if the table is empty. Categories and recipes are seeded per user (create a user first).

## Development

- **Frontend and backend together:**  
  `npm start`  
  (runs Express and Vite in one terminal via concurrently)

- **Frontend only:**  
  `npm run dev`  
  (Vite with proxy to `http://localhost:3001` for `/api`)

- **Backend only:**  
  `npm run server`  
  (Express on port 3001)

- **Apply schema then start:**  
  `npm run dev:all`  
  (runs `db:push` then `npm start`)

- **Lint:**  
  `npm run lint` / `npm run lint:fix`

- **Prisma Studio (DB UI):**  
  `npm run db:studio`  
  (opens database browser at http://localhost:5555)

## Theming

- **Appearance**: User menu (top right) → **Settings** → **Appearance**. Choose light, dark, or system.
- **Colors**: All theme colors are defined in `src/styles/theme.css`. Edit `:root` for light mode and `.dark` for dark mode; base variables (e.g. `--background`, `--card`) and semantic ones (`--color-success`, `--color-warning`, `--color-danger`, `--color-brand`) are managed there.

## Production

- **Build frontend:** `npm run build`
- **Backend:** run with `tsx server/index.ts` (or `node --import tsx server/index.ts`). There is no separate server build step.
- **Database:** For production use e.g. PostgreSQL and set `DATABASE_URL` and `provider` in `prisma/schema.prisma`.
- **Environment:** Set `VITE_API_URL` to the public API URL when the frontend is served from another origin so the client can reach the API.

## Project Structure (overview)

- `src/app/` – React app (pages, components, stores, hooks, lib)
- `src/app/pages/` – Dashboard, Inventory, Must-Have, Wishlist, Recipes, Deals, **Settings** (Categories, Appearance), Login, Signup
- `src/app/components/recipe/` – Recipe page UI: RecipeCard, RecipeEditDialog, RecipeListSection, RecipeStatCard, RecipeViewDialog (import from `../components/recipe`)
- `src/app/stores/` – Zustand stores (Auth, Inventory, MustHave, Wishlist, Recipes, Deals, Categories)
- `src/app/hooks/` – Custom hooks (e.g. useRecipeForm, useRecipesWithMatch)
- `src/app/lib/api/` – API client modules (resource functions per domain, error handling via `ApiError`; entry point `api/index.ts`)
- `src/styles/theme.css` – **Central theme and colors**: light/dark mode, all CSS variables (`:root` and `.dark`). Edit only this file to change app-wide colors.
- `server/` – Express API (routes, middleware, Prisma)
- `prisma/schema.prisma` – Data model (User, Category, InventoryItem, MustHaveItem, WishListItem, Recipe, Deal)

## API (examples)

- `GET /api/health` – Health check (no auth)
- `POST /api/auth/login` – Login (email, password)
- `POST /api/auth/signup` – Sign up (username, email, password, inviteCode)
- `GET/POST/PATCH/DELETE /api/inventory` – Inventory
- `GET/POST/DELETE /api/must-have` – Must-have list
- `GET/POST/DELETE /api/wishlist` – Wishlist
- `GET/POST/PATCH/DELETE /api/recipes` – Recipes
- `GET /api/deals` – Deals (optional auth)
- `GET/POST/DELETE /api/categories` – Categories

Protected routes require header: `Authorization: Bearer <token>`.

---

For a detailed codebase overview (structure, conventions, API, data model), see [AGENTS.md](./AGENTS.md).
