# AGENTS.md – VorratsCheck Codebase Overview

This document describes the **VorratsCheck** codebase for AI agents and developers. VorratsCheck is a food storage management app: inventory, wishlist, must-have list, recipes, deals, and categories.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite 6, React Router 7, Tailwind CSS 4, Zustand 5 |
| **UI** | Radix UI primitives, Lucide icons (central re-export in `src/app/lib/icons.ts`), shadcn-style components in `src/app/components/ui/` |
| **Backend** | Express 4, TypeScript (tsx) |
| **Database** | Prisma 6, SQLite (dev); production can use PostgreSQL |
| **Auth** | JWT (jsonwebtoken), bcryptjs; token in `Authorization: Bearer <token>` and `localStorage` key `vorratscheck_token` |

---

## Repository Layout

```
VorratsCheck/
├── shared/
│   ├── constants.ts             # Shared constants & types (units, priorities, difficulties, etc.) — used by both frontend (@shared/constants) and backend (../../shared/constants.js)
│   └── validation.ts            # Shared validation helpers (isValidNumber, isValidDate, etc.) — used by both frontend (@shared/validation) and backend (../../shared/validation.js)
├── src/
│   ├── main.tsx                 # Entry: React root, mounts App
│   └── app/
│       ├── App.tsx              # RouterProvider, DataLoader, Toaster
│       ├── routes.tsx           # createBrowserRouter: public /login, /signup; protected / with Layout
│       ├── lib/
│       │   ├── api/            # API client (modular; do not call api() directly)
│       │   │   ├── index.ts    # Re-exports: errors, getAuthHeader, resource functions
│       │   │   ├── errors.ts   # ApiError, isApiError(), getErrorMessage()
│       │   │   ├── client.ts   # getAuthHeader(), internal api() – base HTTP client; translates server error keys via translate()
│       │   │   ├── crud.ts     # createCrud(basePath) – shared get/create/update/delete
│       │   │   ├── inventory.ts # getInventory, create/update/deleteInventoryItem
│       │   │   ├── mustHave.ts  # getMustHave, createMustHaveItem, updateMustHaveItem, deleteMustHaveItem
│       │   │   ├── wishlist.ts  # getWishlist, createWishlistItem, updateWishlistItem, deleteWishlistItem
│       │   │   ├── categories.ts# getCategories, createCategory, deleteCategory
│       │   │   ├── recipes.ts   # getRecipes, create/update/deleteRecipe, importRecipe
│       │   │   ├── deals.ts     # getDeals
│       │   │   └── auth.ts      # login, signup
│       │   ├── i18n/            # Internationalization system (DE + EN, fallback: EN)
│       │   │   ├── index.ts    # useTranslation() hook: t(key, params?), formatDate(date), locale; translate() non-hook for API layer
│       │   │   ├── de.ts       # German translations (default)
│       │   │   └── en.ts       # English translations (fallback)
│       │   ├── units.ts        # UNITS, convertFromGivenToBaseUnit, convertFromBaseToGivenUnit, quantityCovers
│       │   ├── recipe.ts       # Recipe helpers (ingredients, difficulty, inventory matching)
│       │   ├── mustHave.ts     # getStockStatus (unit-aware low-stock logic for Dashboard and Must-Have)
│       │   ├── inventory.ts    # INVENTORY_LOCATION_OPTIONS, getExpiryStatus (expiry badge for Inventory cards)
│       │   ├── icons.ts       # Re-export of Lucide icons used in the app; import from '@/app/lib/icons'
│       │   └── format.ts       # formatDateDE(date) – legacy German date display; prefer formatDate() from useTranslation()
│       ├── stores/              # Zustand stores (auth persisted; others fetch on login)
│       │   ├── authStore.ts
│       │   ├── settingsStore.ts   # Settings (locale), persisted to localStorage
│       │   ├── inventoryStore.ts
│       │   ├── mustHaveStore.ts
│       │   ├── wishlistStore.ts
│       │   ├── recipesStore.ts
│       │   ├── dealsStore.ts
│       │   └── categoriesStore.ts
│       ├── hooks/               # Custom hooks
│       │   ├── useRecipesPage.ts   # Recipes page: match/sort, form (add/edit), delete
│       │   ├── useInventoryPage.ts # Inventory page: form (add/edit), filters, CRUD
│       │   ├── useMustHavePage.ts  # Must-Have page: form (add/edit), stock counts, CRUD
│       │   ├── useWishlistPage.ts  # Wishlist page: form (add/edit), grouped by priority, CRUD
│       │   ├── useDealsPage.ts     # Deals page: filter (all/mustHave/wishList), match counts, filtered deals
│       │   └── useBarcodeScanner.ts # Barcode scanner: Html5Qrcode start/stop, autoStart, error state
│       ├── pages/               # Route components
│       │   ├── Dashboard.tsx
│       │   ├── Inventory.tsx
│       │   ├── MustHaveList.tsx
│       │   ├── WishList.tsx
│       │   ├── Deals.tsx
│       │   ├── Recipes.tsx
│       │   ├── Categories.tsx
│       │   ├── Settings.tsx     # Settings layout (nav: Categories, Appearance, Language)
│       │   ├── Appearance.tsx    # Theme: light / dark / system (redirects to Settings)
│       │   ├── Login.tsx
│       │   └── Signup.tsx
│       └── components/
│           ├── Layout.tsx       # Header, nav (Dashboard, Vorrat, Must-Have, Wunschliste, Angebote, Rezepte), user menu (Settings, Logout), Outlet
│           ├── ProtectedRoute.tsx  # Redirects to /login if not authenticated; shows loading while auth resolves
│           ├── BarcodeScanner.tsx
│           ├── Quantity.tsx     # Quantity + unit input (used in recipe form, etc.)
│           ├── dashboard/       # Dashboard alert and quick-action cards (import from '../components/dashboard')
│           │   ├── index.ts     # Re-exports all dashboard components
│           │   ├── ExpiredItemsCard.tsx
│           │   ├── ExpiringSoonCard.tsx
│           │   ├── LowStockCard.tsx
│           │   └── QuickActionsCard.tsx
│           ├── inventory/       # Inventory page UI (import from '../components/inventory')
│           │   ├── index.ts     # Re-exports all inventory components
│           │   ├── InventoryItemFormDialog.tsx
│           │   ├── InventoryItemCard.tsx
│           │   ├── InventoryFilter.tsx
│           │   ├── InventoryFilterBar.tsx
│           │   └── InventoryEmptyState.tsx
│           ├── mustHave/        # Must-Have page UI (import from '../components/mustHave')
│           │   ├── index.ts     # Re-exports all must-have components
│           │   ├── MustHaveCard.tsx
│           │   ├── MustHaveStats.tsx
│           │   ├── MustHaveEmptyState.tsx
│           │   └── MustHaveItemDialog.tsx
│           ├── wishlist/        # Wishlist page UI (import from '../components/wishlist')
│           │   ├── index.ts     # Re-exports all wishlist components
│           │   ├── priorityUtils.ts   # getPriorityColor, getPriorityLabel, WishlistPriority type
│           │   ├── WishlistItemDialog.tsx
│           │   ├── WishlistItemCard.tsx
│           │   ├── WishlistStats.tsx
│           │   ├── WishlistPrioritySection.tsx
│           │   └── WishlistEmptyState.tsx
│           ├── recipe/          # Recipe page UI (import from '../components/recipe')
│           │   ├── index.ts     # Re-exports all recipe components
│           │   ├── RecipeCard.tsx
│           │   ├── RecipeEditDialog.tsx
│           │   ├── RecipeImportDialog.tsx
│           │   ├── RecipeListSection.tsx
│           │   └── RecipeViewDialog.tsx
│           ├── settings/       # Settings sub-pages (Categories, Appearance, Language)
│           │   ├── SettingsCategories.tsx
│           │   ├── SettingsAppearance.tsx
│           │   └── SettingsLanguage.tsx
│           └── ui/              # Radix/shadcn-style primitives (button, dialog, select, stat-card, etc.)
├── src/styles/
│   └── index.css                 # Global CSS: :root / .dark tokens, Tailwind @theme, base layer, skip link
├── server/
│   ├── app.ts                   # Express app: CORS, JSON, mounts /api/* routes, /api/health (exported for tests)
│   ├── index.ts                 # Runs app.listen(); use app from app.ts for programmatic/testing use
│   ├── lib/prisma.ts            # Prisma client singleton
│   ├── lib/recipeImport.ts      # Recipe URL import: fetches URL, extracts JSON-LD Schema.org Recipe data (cheerio)
│   ├── middleware/auth.ts       # authMiddleware (required), optionalAuth, signToken; JWT_SECRET
│   └── routes/
│       ├── auth.ts              # POST /api/auth/login, /api/auth/signup
│       ├── inventory.ts         # GET/POST /api/inventory, PATCH/DELETE /api/inventory/:id
│       ├── mustHave.ts          # GET/POST/PATCH/DELETE /api/must-have
│       ├── wishlist.ts          # GET/POST/PATCH/DELETE /api/wishlist
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
│   ├── dev.db                   # SQLite dev DB (gitignored; created by db:push)
│   └── test.db                  # SQLite test DB for API integration tests (gitignored)
├── test/
│   ├── setup.ts                 # Shared Vitest setup
│   ├── unit/
│   │   └── lib/
│   │       └── recipeImport.test.ts  # Recipe URL import: JSON-LD parsing, ingredient mapping, fallback (mocked fetch)
│   └── integration/
│       ├── api/                 # API integration tests (real API client, test DB)
│       │   ├── auth.api.test.ts # signup, login, getInventory, createInventoryItem, health
│       │   ├── setup-db.ts      # Sets DATABASE_URL to test.db, runs prisma db push
│       │   └── setup-server.ts  # Starts Express app on random port, sets VITE_API_URL, localStorage polyfill
│       └── *.integration.test.tsx # UI integration tests (e.g. Login, ProtectedRoute, Dashboard)
├── vitest.integration-api.config.ts  # Vitest config for test/integration/api/** (Node, test DB)
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
- **WishListItem** – userId, name, type ('category' | 'specific'), category?, brand?, priority ('low' | 'medium' | 'high'). The UI uses a single form (name required; category and brand optional; priority). New/updated items are sent with type `'specific'`; the type field is kept for API/DB compatibility.
- **Recipe** – userId, name, ingredients (JSON array), instructions (JSON array), cookingTime, difficulty, servings.
- **Deal** – product, name (category name for display, e.g. Milchprodukte), store, originalPrice, discountPrice, discount (%), validUntil, distance, inStock?; userId optional (nullable for seeded deals).

All user-scoped routes use `authMiddleware` and filter by `req.user.userId` from the JWT.

---

## Conventions and Patterns

- **Comments**: Use English only for all source-code comments (TS/TSX, JS, Prisma, scripts). UI copy is translated via i18n (German default, English fallback).

### Frontend

- **Routing**: React Router 7 `createBrowserRouter`. Public: `/login`, `/signup`. Protected: `/` with `Layout` and children (index = Dashboard, then inventory, must-have, wishlist, deals, recipes, categories).
- **Auth**: `useAuthStore` (Zustand + persist). Token in `localStorage` key `vorratscheck_token`. `ProtectedRoute` checks `user` and `isLoading`; redirects to `/login` when not authenticated.
- **Data loading**: When `user` is set, `App.tsx`’s `DataLoader` calls `fetch()` on inventory, mustHave, wishlist, categories, recipes, and deals stores once.
- **API**: Use resource functions from `src/app/lib/api` (e.g. `getInventory`, `createCategory`, `login`). Do not call the internal `api()` directly. Base URL from `VITE_API_URL`; `Content-Type: application/json` and `Authorization: Bearer <token>` (via `getAuthHeader()`) are set in the client. On non-2xx or network errors the client throws `ApiError` (with `status`, `message`, optional `details`; helpers: `isApiError(e)`, `getErrorMessage(e)`; getters: `isUnauthorized`, `isNotFound`, `isServerError`).
- **Stores**: Zustand. Each domain store (inventory, mustHave, wishlist, recipes, deals, categories) has `fetch` and CRUD-style methods that call the API layer (e.g. `getInventory`, `createRecipe`) and update local state. Auth store has `login`, `signup`, `logout`, `setUserFromToken`, `setLoading`.
- **UI**: Tailwind + Radix-based components under `src/app/components/ui/`. User menu: Settings → sub-nav for Categories, Appearance (light/dark/system), and Language (DE/EN). Categories are under Settings, not main nav.
- **Icons**: Lucide icons are re-exported from `src/app/lib/icons.ts`. Import from `@/app/lib/icons` (e.g. `import { Plus, Trash2 } from '@/app/lib/icons'`). Add new icons to `icons.ts` when needed; do not import from `lucide-react` directly in app code.
- **Date display**: Use `formatDate(date)` from `useTranslation()` (`src/app/lib/i18n`) for locale-aware dates in the UI (dashboard, inventory, deal cards).
- **Theming**: `next-themes` in `main.tsx`; theme preference in `settingsStore` (synced to next-themes via `SyncThemeFromStore` in `App.tsx`). CSS variables and Tailwind `@theme` live in `src/styles/index.css`: `:root` (light), `.dark` (dark). Edit that file for app-wide colors; base vars (e.g. `--background`, `--card`) and semantic overrides in `.dark` only (`--color-success`, `--color-warning`, `--color-danger`, `*_bg`, `*_border`, etc., for Tailwind utility fixes). MUI palette: `src/app/lib/muiTheme.ts`. UI copy is translated via `t('key')` (German default, English fallback).

### Backend

- **Express**: JSON body parser, CORS (origin from `VITE_ORIGIN` or `http://localhost:5173`). Routes under `/api/*`; health at `GET /api/health`.
- **Auth**: `authMiddleware` expects `Authorization: Bearer <token>`, verifies JWT, sets `req.user = { userId, email }`. `optionalAuth` used for deals. Login/signup use `signToken` and bcrypt for passwords; signup requires `inviteCode` matching `INVITE_CODE`.
- **Routes**: Each resource has its own router; protected routes call `authMiddleware` and use `(req as Request & { user?: JwtPayload }).user!.userId` for Prisma `where: { userId }`.
- **Errors**: Typically `res.status(4xx|5xx).json({ error: '...' })`; frontend expects `error` in the JSON body.

### Database

- **Prisma**: `prisma generate`, `prisma db push`. Seeds in `scripts/`: `npm run db:seed-deals`, `db:seed-categories`, `db:seed-recipes`. Each seed **overwrites** its data (deletes existing, then inserts defaults). SQLite for dev; production can switch to PostgreSQL via `DATABASE_URL` and `provider` in `schema.prisma`.

### Testing

- **Unit/component tests**: Vitest; `npm run test` (watch) or `npm run test:run` (single run). Config in `vitest.config.ts`; includes `src/**/*.test.{ts,tsx}` and `test/unit/**`; excludes `test/integration/api/**` so the default run does not use the test DB. Includes `test/unit/lib/recipeImport.test.ts` (recipe URL import parsing with mocked HTML).
- **API integration tests**: In `test/integration/api/`. Use the **real API client** from `src/app/lib/api` (e.g. `login`, `signup`, `getInventory`, `createMustHave`, `getCategories`); do not use raw HTTP/supertest. Run with `npm run test:integration:api` (sets `DATABASE_URL=file:./data/test.db`). Setup: `setup-db.ts` pushes schema to test DB; `setup-server.ts` starts the Express app on a random port, sets `process.env.VITE_API_URL`, and provides a `localStorage` polyfill so `getAuthHeader()` works. Tests clean the DB in `beforeEach` and set `localStorage.setItem('vorratscheck_token', token)` after login/signup for protected calls. Config: `vitest.integration-api.config.ts` runs tests with `pool: 'forks'` and `singleFork: true` so tests run sequentially and do not share the same DB state across files. Test files: `auth.api.test.ts` (auth, inventory CRUD, health), `resources.api.test.ts` (must-have, wishlist, categories, recipes, deals).

---

## Scripts (package.json)

- `npm start` – Run backend + Vite dev (concurrently).
- `npm run dev` – Vite only (proxies `/api` to port 3001).
- `npm run server` – Backend only (tsx server/index.ts, port 3001).
- `npm run dev:all` – `db:push` then `npm start`.
- `npm run build` – Vite production build.
- `npm run db:generate` / `db:push` – Prisma generate, push schema. `db:seed-deals` / `db:seed-categories` / `db:seed-recipes` – run scripts in `scripts/`.
- `npm run lint` / `lint:fix` – ESLint.
- `npm run test` / `test:run` – Vitest: component/unit tests (main config; excludes `test/integration/api/**`).
- `npm run test:integration:api` – API integration tests: uses **real API client** (e.g. `login`, `signup`, `getInventory`, `createMustHave`, `getCategories` from `src/app/lib/api`) against test DB; `vitest.integration-api.config.ts` runs `setup-db.ts` (test DB push) and `setup-server.ts` (start app, set `VITE_API_URL`, `localStorage` polyfill), then `test/integration/api/**/*.test.ts` with `singleFork: true` (sequential) to avoid shared-DB conflicts.

---

## API Summary (Protected Unless Noted)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Body: email, password. Returns token, user. |
| POST | /api/auth/signup | Body: username, email, password, inviteCode. Returns token, user. |
| GET | /api/health | No auth. Returns { ok: true }. |
| GET/POST | /api/inventory | List / create. PATCH/DELETE /api/inventory/:id. |
| GET/POST/PATCH/DELETE | /api/must-have | Must-have list. |
| GET/POST/PATCH/DELETE | /api/wishlist | Wishlist. |
| GET/POST/PATCH/DELETE | /api/recipes | Recipes. |
| POST | /api/recipes/import | Import recipe from URL (extracts JSON-LD Schema.org Recipe data). Body: { url }. |
| GET | /api/deals | Optional auth; authenticated users see own + seeded deals, unauthenticated see only seeded. |
| POST | /api/deals | Create deal (auth required). |
| DELETE | /api/deals/:id | Delete own deal (auth required). |
| GET/POST/DELETE | /api/categories | Categories. |

Protected routes require header: `Authorization: Bearer <token>`.

---

## Where to Change Things

- **New API route**: Add router in `server/routes/`, mount in `server/app.ts`. On the frontend add a module under `src/app/lib/api/` (e.g. `api/foo.ts`) with resource functions that use `api()` from `./client` or `createCrud()` from `./crud`; re-export from `src/app/lib/api/index.ts`. Add corresponding Zustand actions and (if needed) types in `src/app/stores/`; call from pages or components.
- **New page**: Add component in `src/app/pages/`, add route in `src/app/routes.tsx`, add nav entry in `Layout.tsx` if needed.
- **Auth flow**: `server/routes/auth.ts`, `server/middleware/auth.ts`, `src/app/stores/authStore.ts`, `src/app/components/ProtectedRoute.tsx`.
- **Data model**: `prisma/schema.prisma`, then `db:generate` and `db:push`; adjust routes and stores.
- **UI/theme**: Tailwind + MUI components in `src/app/components/ui/`; app shell and nav in `Layout.tsx`. **CSS colors / Tailwind tokens**: edit `src/styles/index.css` (`:root`, `.dark`, `@theme inline`). **MUI**: `src/app/lib/muiTheme.ts`. **Appearance**: user menu → Settings → Appearance (light/dark/system). **Language**: user menu → Settings → Language (DE/EN). **Categories**: user menu → Settings → Categories. **Icons**: Add or use icons via `src/app/lib/icons.ts`; import from `@/app/lib/icons` (do not import from `lucide-react` directly in app code).
- **Recipe UI**: All recipe-related components live in `src/app/components/recipe/` (RecipeCard, RecipeEditDialog, RecipeImportDialog, RecipeListSection, RecipeViewDialog). Import from `../components/recipe`. The Recipes page uses a single hook `useRecipesPage()` (match/sort, form state, delete); lib helpers in `src/app/lib/recipe.ts` (ingredients, difficulty, matching) and `lib/units.ts` (convertFromGivenToBaseUnit, convertFromBaseToGivenUnit, quantityCovers for matching).
- **Dashboard UI**: Alert and quick-action cards in `src/app/components/dashboard/` (ExpiredItemsCard, ExpiringSoonCard, LowStockCard, QuickActionsCard). Import from `../components/dashboard`. Dashboard page uses StatCard for stats and these components for alerts and quick actions. Dates use `formatDate(date)` from `useTranslation()` (`lib/i18n`) for locale-aware display.
- **Inventory UI**: Components in `src/app/components/inventory/` (InventoryItemFormDialog, InventoryItemCard, InventoryFilter, InventoryFilterBar, InventoryEmptyState). Import from `../components/inventory`. The Inventory page uses `useInventoryPage()` for form state, filters, filtered list, and CRUD. Location options (form and filter) and expiry display come from `lib/inventory.ts` (`INVENTORY_LOCATION_OPTIONS`, `getExpiryStatus`). Date display uses `formatDate(date)` from `useTranslation()`. Dialogs use `Category` from `stores/categoriesStore`.
- **Must-Have UI**: Components in `src/app/components/mustHave/` (MustHaveCard, MustHaveStats, MustHaveEmptyState, MustHaveItemDialog). Import from `../components/mustHave`. The Must-Have page uses `useMustHavePage()` for form state, stock counts (sufficient/low), and CRUD. Dialogs use `Category` from `stores/categoriesStore`. Low-stock logic (Dashboard and Must-Have page) uses `lib/mustHave.ts` (`getStockStatus`) for unit-aware comparison (weight→g, volume→ml, countable→same unit).
- **Wishlist UI**: Components in `src/app/components/wishlist/` (WishlistItemDialog, WishlistItemCard, WishlistStats, WishlistPrioritySection, WishlistEmptyState, priorityUtils). Import from `../components/wishlist`. The Wishlist page uses `useWishlistPage()` for form state, grouped items, and CRUD. Dialogs use `Category` from `stores/categoriesStore`. The wishlist form has no type selector; name is required, category and brand are optional and always shown; priority is required. Items are grouped by priority on the page.
- **Deals page**: Uses `useDealsPage()` for filter state (all/mustHave/wishList), match logic (must-have, wishlist), and filtered deals. Components in `src/app/components/deals/` (DealCard, DealsStats, DealsFilterBar, DealsEmptyState). Import from `../components/deals`. Deal “valid until” dates use `formatDate(date)` from `useTranslation()`.

---

## Language and Locale

- **UI language**: German (default) and English, switchable via Settings → Appearance → Language. All user-facing text uses `t('key')` from `useTranslation()` hook (`src/app/lib/i18n`). Translations live in `src/app/lib/i18n/de.ts` (German) and `en.ts` (English, fallback). Locale is persisted in `settingsStore` (`localStorage` key `vorratscheck-settings`). Use `formatDate(date)` from the hook for locale-aware date display. When adding new UI text, add keys to both `de.ts` and `en.ts`.
- **Comments**: Always in English (in source code, scripts, and schema). This keeps the codebase consistent for agents and international contributors.
- **AGENTS.md and this file**: English for clarity for agents and international contributors.
