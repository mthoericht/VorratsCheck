# AGENTS.md – VorratsCheck Codebase Overview

This document describes the **VorratsCheck** codebase for AI agents and developers. VorratsCheck is a food storage management app: inventory, wishlist, must-have list, recipes, deals, and categories.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite 6, React Router 7, Tailwind CSS 4, Zustand 5 |
| **UI** | Radix UI primitives, Lucide icons, shadcn-style components in `src/app/components/ui/` |
| **Backend** | Express 4, TypeScript (tsx) |
| **Database** | Prisma 6, SQLite (dev); production can use PostgreSQL |
| **Auth** | JWT (jsonwebtoken), bcryptjs; token in `Authorization: Bearer <token>` and `localStorage` key `vorratscheck_token` |

---

## Repository Layout

```
VorratsCheck/
├── src/
│   ├── main.tsx                 # Entry: React root, mounts App
│   └── app/
│       ├── App.tsx              # RouterProvider, DataLoader, Toaster
│       ├── routes.tsx           # createBrowserRouter: public /login, /signup; protected / with Layout
│       ├── lib/
│       │   └── api/            # API client (modular; do not call api() directly)
│       │       ├── index.ts    # Re-exports: errors, getAuthHeader, resource functions
│       │       ├── errors.ts   # ApiError, isApiError(), getErrorMessage()
│       │       ├── client.ts   # getAuthHeader(), internal api() – base HTTP client
│       │       ├── crud.ts     # createCrud(basePath) – shared get/create/update/delete
│       │       ├── inventory.ts # getInventory, create/update/deleteInventoryItem
│       │       ├── mustHave.ts  # getMustHave, createMustHaveItem, deleteMustHaveItem
│       │       ├── wishlist.ts  # getWishlist, createWishlistItem, deleteWishlistItem
│       │       ├── categories.ts# getCategories, createCategory, deleteCategory
│       │       ├── recipes.ts   # getRecipes, create/update/deleteRecipe
│       │       ├── deals.ts     # getDeals
│       │       └── auth.ts      # login, signup
│       ├── stores/              # Zustand stores (auth persisted; others fetch on login)
│       │   ├── authStore.ts
│       │   ├── inventoryStore.ts
│       │   ├── mustHaveStore.ts
│       │   ├── wishlistStore.ts
│       │   ├── recipesStore.ts
│       │   ├── dealsStore.ts
│       │   └── categoriesStore.ts
│       ├── hooks/               # Custom hooks
│       │   └── useRecipesPage.ts  # Recipes page: match/sort, form (add/edit), delete
│       ├── pages/               # Route components
│       │   ├── Dashboard.tsx
│       │   ├── Inventory.tsx
│       │   ├── MustHaveList.tsx
│       │   ├── WishList.tsx
│       │   ├── Deals.tsx
│       │   ├── Recipes.tsx
│       │   ├── Categories.tsx
│       │   ├── Settings.tsx     # Settings layout (nav: Categories, Appearance)
│       │   ├── Appearance.tsx    # Theme: light / dark / system
│       │   ├── Login.tsx
│       │   └── Signup.tsx
│       └── components/
│           ├── Layout.tsx       # Header, nav (Dashboard, Vorrat, Must-Have, Wunschliste, Angebote, Rezepte), user menu (Settings, Logout), Outlet
│           ├── ProtectedRoute.tsx  # Redirects to /login if not authenticated; shows loading while auth resolves
│           ├── BarcodeScanner.tsx
│           ├── Quantity.tsx     # Quantity + unit input (used in recipe form, etc.)
│           ├── figma/ImageWithFallback.tsx
│           ├── recipe/          # Recipe page UI (import from '../components/recipe')
│           │   ├── index.ts     # Re-exports all recipe components
│           │   ├── RecipeCard.tsx
│           │   ├── RecipeEditDialog.tsx
│           │   ├── RecipeListSection.tsx
│           │   ├── RecipeStatCard.tsx
│           │   └── RecipeViewDialog.tsx
│           └── ui/              # Radix/shadcn-style primitives (button, dialog, select, etc.)
├── src/styles/
│   ├── index.css                 # Imports theme.css, tailwind
│   └── theme.css                 # Central theme: :root (light), .dark (dark), CSS variables
├── server/
│   ├── index.ts                 # Express app: CORS, JSON, mounts /api/* routes, /api/health
│   ├── lib/prisma.ts            # Prisma client singleton
│   ├── middleware/auth.ts       # authMiddleware (required), optionalAuth, signToken; JWT_SECRET
│   └── routes/
│       ├── auth.ts              # POST /api/auth/login, /api/auth/signup
│       ├── inventory.ts         # GET/POST /api/inventory, PATCH/DELETE /api/inventory/:id
│       ├── mustHave.ts          # GET/POST/DELETE /api/must-have
│       ├── wishlist.ts          # GET/POST/DELETE /api/wishlist
│       ├── recipes.ts           # GET/POST/PATCH/DELETE /api/recipes
│       ├── deals.ts             # GET /api/deals (optionalAuth: user-scoped or all)
│       └── categories.ts        # GET/POST/DELETE /api/categories
├── prisma/
│   └── schema.prisma            # Data model (see below)
├── scripts/                     # Seed scripts (run via npm run db:seed-*)
│   ├── seed-deals.ts            # Initial deals if empty
│   ├── seed-categories.ts       # Default categories per user
│   └── seed-recipes.ts          # Default recipes per user
├── data/
│   └── dev.db                   # SQLite DB (gitignored; created by db:push)
├── public/
├── index.html
├── vite.config.ts               # React + Tailwind; alias @ → src; proxy /api → localhost:3001
├── package.json
└── .env                         # DATABASE_URL, JWT_SECRET, INVITE_CODE (copy from .env.example)
```

---

## Data Model (Prisma)

- **User** – id, email, username, passwordHash, createdAt; relations to all user-scoped entities.
- **Category** – id, userId, name. User-defined categories; used in inventory, must-have, and wishlist (selectable only, no free text).
- **InventoryItem** – userId, name, category, brand?, barcode?, quantity, unit, expiryDate?, location?, addedDate.
- **MustHaveItem** – userId, name, category?, minQuantity (default 1). “Always in stock” items; matched by name (and optionally category).
- **WishListItem** – userId, name, type ('category' | 'specific'), category?, brand?, priority ('low' | 'medium' | 'high').
- **Recipe** – userId, name, ingredients (JSON array), instructions (JSON array), cookingTime, difficulty, servings.
- **Deal** – product, category, store, originalPrice, discountPrice, discount (%), validUntil, distance, inStock?; userId optional (nullable for seeded deals).

All user-scoped routes use `authMiddleware` and filter by `req.user.userId` from the JWT.

---

## Conventions and Patterns

- **Comments**: Use English only for all source-code comments (TS/TSX, JS, Prisma, scripts). UI copy stays in German.

### Frontend

- **Routing**: React Router 7 `createBrowserRouter`. Public: `/login`, `/signup`. Protected: `/` with `Layout` and children (index = Dashboard, then inventory, must-have, wishlist, deals, recipes, categories).
- **Auth**: `useAuthStore` (Zustand + persist). Token in `localStorage` key `vorratscheck_token`. `ProtectedRoute` checks `user` and `isLoading`; redirects to `/login` when not authenticated.
- **Data loading**: When `user` is set, `App.tsx`’s `DataLoader` calls `fetch()` on inventory, mustHave, wishlist, categories, recipes, and deals stores once.
- **API**: Use resource functions from `src/app/lib/api` (e.g. `getInventory`, `createCategory`, `login`). Do not call the internal `api()` directly. Base URL from `VITE_API_URL`; `Content-Type: application/json` and `Authorization: Bearer <token>` (via `getAuthHeader()`) are set in the client. On non-2xx or network errors the client throws `ApiError` (with `status`, `message`, optional `details`; helpers: `isApiError(e)`, `getErrorMessage(e)`; getters: `isUnauthorized`, `isNotFound`, `isServerError`).
- **Stores**: Zustand. Each domain store (inventory, mustHave, wishlist, recipes, deals, categories) has `fetch` and CRUD-style methods that call the API layer (e.g. `getInventory`, `createRecipe`) and update local state. Auth store has `login`, `signup`, `logout`, `setUserFromToken`, `setLoading`.
- **UI**: Tailwind + Radix-based components under `src/app/components/ui/`. User menu: Settings → sub-nav for Categories and Appearance (light/dark/system). Categories are under Settings, not main nav.
- **Theming**: `next-themes` in `main.tsx`; theme in `localStorage` key `vorratscheck-theme`. All colors in `src/styles/theme.css`: `:root` (light), `.dark` (dark). Edit only that file for app-wide colors; base vars (e.g. `--background`, `--card`) and semantic (`--color-success`, `--color-warning`, `--color-danger`, `--color-brand` + `*_bg`, `*_border`). Layout and copy use German (e.g. “Vorrat”, “Wunschliste”, “Kategorien”, “Abmelden”).

### Backend

- **Express**: JSON body parser, CORS (origin from `VITE_ORIGIN` or `http://localhost:5173`). Routes under `/api/*`; health at `GET /api/health`.
- **Auth**: `authMiddleware` expects `Authorization: Bearer <token>`, verifies JWT, sets `req.user = { userId, email }`. `optionalAuth` used for deals. Login/signup use `signToken` and bcrypt for passwords; signup requires `inviteCode` matching `INVITE_CODE`.
- **Routes**: Each resource has its own router; protected routes call `authMiddleware` and use `(req as Request & { user?: JwtPayload }).user!.userId` for Prisma `where: { userId }`.
- **Errors**: Typically `res.status(4xx|5xx).json({ error: '...' })`; frontend expects `error` in the JSON body.

### Database

- **Prisma**: `prisma generate`, `prisma db push`. Seeds live in `scripts/`: `npm run db:seed-deals`, `db:seed-categories`, `db:seed-recipes`. SQLite for dev; production can switch to PostgreSQL via `DATABASE_URL` and `provider` in `schema.prisma`.

---

## Scripts (package.json)

- `npm start` – Run backend + Vite dev (concurrently).
- `npm run dev` – Vite only (proxies `/api` to port 3001).
- `npm run server` – Backend only (tsx server/index.ts, port 3001).
- `npm run dev:all` – `db:push` then `npm start`.
- `npm run build` – Vite production build.
- `npm run db:generate` / `db:push` – Prisma generate, push schema. `db:seed-deals` / `db:seed-categories` / `db:seed-recipes` – run scripts in `scripts/`.
- `npm run lint` / `lint:fix` – ESLint.

---

## API Summary (Protected Unless Noted)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Body: email, password. Returns token, user. |
| POST | /api/auth/signup | Body: username, email, password, inviteCode. Returns token, user. |
| GET | /api/health | No auth. Returns { ok: true }. |
| GET/POST | /api/inventory | List / create. PATCH/DELETE /api/inventory/:id. |
| GET/POST/DELETE | /api/must-have | Must-have list. |
| GET/POST/DELETE | /api/wishlist | Wishlist. |
| GET/POST/PATCH/DELETE | /api/recipes | Recipes. |
| GET | /api/deals | Optional auth; user-scoped or all deals. |
| GET/POST/DELETE | /api/categories | Categories. |

Protected routes require header: `Authorization: Bearer <token>`.

---

## Where to Change Things

- **New API route**: Add router in `server/routes/`, mount in `server/index.ts`. On the frontend add a module under `src/app/lib/api/` (e.g. `api/foo.ts`) with resource functions that use `api()` from `./client` or `createCrud()` from `./crud`; re-export from `src/app/lib/api/index.ts`. Add corresponding Zustand actions and (if needed) types in `src/app/stores/`; call from pages or components.
- **New page**: Add component in `src/app/pages/`, add route in `src/app/routes.tsx`, add nav entry in `Layout.tsx` if needed.
- **Auth flow**: `server/routes/auth.ts`, `server/middleware/auth.ts`, `src/app/stores/authStore.ts`, `src/app/components/ProtectedRoute.tsx`.
- **Data model**: `prisma/schema.prisma`, then `db:generate` and `db:push`; adjust routes and stores.
- **UI/theme**: Tailwind + components in `src/app/components/ui/`; app shell and nav in `Layout.tsx`. **Colors**: edit only `src/styles/theme.css` – `:root` (light) and `.dark` (dark) with base and semantic variables. **Appearance**: user menu → Settings → Appearance (light/dark/system). **Categories**: user menu → Settings → Categories.
- **Recipe UI**: All recipe-related components live in `src/app/components/recipe/` (RecipeCard, RecipeEditDialog, RecipeListSection, RecipeStatCard, RecipeViewDialog). Import from `../components/recipe`. The Recipes page uses a single hook `useRecipesPage()` (match/sort, form state, delete); lib helpers in `src/app/lib/recipe.ts` (ingredients, difficulty, matching) and `units.ts` (conversion for matching).

---

## Language and Locale

- **UI language**: German (labels, buttons, placeholders, error messages).
- **Comments**: Always in English (in source code, scripts, and schema). This keeps the codebase consistent for agents and international contributors.
- **AGENTS.md and this file**: English for clarity for agents and international contributors.
