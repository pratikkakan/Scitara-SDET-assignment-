# Scitara SDET Assignment

A full-stack project demonstrating production-grade SDET practices across three workspaces:

| Workspace | Purpose |
|-----------|---------|
| `backend/` | Node.js/Express REST API for user management with WebSocket events |
| `frontend/` | React/Vite e-commerce SPA |
| `automation/` | Playwright test suite (API, UI, WebSocket) |

---

## What This Codebase Is

This is a monorepo (npm workspaces) used as an SDET assignment. It includes:

- A **backend API** that can be tested directly via HTTP and WebSocket clients
- A **frontend e-commerce app** for end-to-end UI automation
- A **Playwright automation suite** that tests both: REST API contracts + CRUD, complete purchase E2E flows, page-wise UI scenarios, and real-time WebSocket events

The automation suite is the primary deliverable — the backend and frontend exist to provide realistic, testable surfaces.

---

## How to Use This Code

### Prerequisites
- Node.js ≥ 18
- npm ≥ 8

### 1. Install All Dependencies
```bash
npm install                  # installs root + all workspaces
```
Or install each workspace individually:
```bash
npm install --workspace=backend
npm install --workspace=frontend
npm install --workspace=automation
```

### 2. Run the Backend
```bash
# Development (hot-reload)
npm run dev:backend          # http://localhost:3000

# Production
npm run build:backend
npm start
```
Set `API_TOKEN` in `backend/.env` if you want auth enabled (leave empty to disable).

### 3. Run the Frontend
```bash
npm run dev:frontend         # http://localhost:5173
```

### 4. Run Tests
Backend and frontend must be running first (or Playwright will auto-start them via `webServer` config).

```bash
# All tests
npm run test:all

# By category
npm run test:api             # API tests only
npm run test:ui              # UI tests only
npm run test:websocket       # WebSocket tests only

# From inside the automation workspace
cd automation
npm test                     # All tests (auto-starts servers if not running)
npm run test:headed          # Show browser
npm run test:debug           # Playwright debug mode
npm run test:ui-mode         # Interactive UI mode
npm run test:report          # Open last HTML report
```

### 5. Docker (Optional)
Each workspace has a Dockerfile. Use the root `docker-compose.yml` to run all services together:
```bash
docker-compose up --build
```

---

## Backend

**Node.js + Express + TypeScript** REST API — user management (CRUD) with in-memory storage, Zod validation, and Socket.IO real-time events.

- Port: `3000`
- Auth: Bearer token (`API_TOKEN` env var). Public endpoints: `GET /` and `GET /health`.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by UUID |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user (any subset of fields) |
| DELETE | `/users/:id` | Delete user |
| * | `/api/users[/:id]` | Alias for `/users[/:id]` |

### Key Files
```
backend/src/
├── app.ts                      # Routes, middleware wiring
├── controllers/user.controller.ts
├── routes/users.routes.ts
├── services/user.service.ts
├── middleware/                  # asyncHandler, authMiddleware, errorHandler, validateRequest
├── validators/user.validator.ts # Zod schemas
├── data/userStore.ts            # In-memory store
└── websocket/                   # Socket.IO event emitters
```

### Response Format
```json
// Success — 200/201
{ "id": "uuid", "firstName": "...", "lastName": "...", "email": "...", "createdAt": "ISO", "updatedAt": "ISO" }

// Error — 4xx/5xx
{ "error": { "code": "EMAIL_ALREADY_EXISTS", "message": "..." } }
```

> See [BACKEND.md](BACKEND.md) for full documentation.

---

## Frontend

**React 18 + Vite + TypeScript** e-commerce SPA — products loaded from a local JSON file, cart managed via React Context.

- Port: `5173`

### Pages
| Route | Page | Features |
|-------|------|---------|
| `/` | Product Listing | Grid, search, category filter, add-to-cart |
| `/products/:id` | Product Details | Info, quantity selector, add-to-cart |
| `/cart` | Cart | Line items, quantity controls, price summary |
| `/checkout` | Checkout | Form, validation, order confirmation |

### Key Files
```
frontend/src/
├── pages/         # ProductListing, ProductDetails, Cart, Checkout
├── components/    # Header, ProductCard, LoadingSpinner, EmptyState
├── context/CartContext.tsx   # Cart state
├── services/      # apiClient.ts, productService.ts
└── data/products.json        # Static product catalogue
```

> See [FRONTEND.md](FRONTEND.md) for full documentation.

---

## Automation

**Playwright + TypeScript** test suite with POM architecture, typed fixtures, and AJV schema validation.

### Test Files

| File | Tests | Coverage |
|------|-------|---------|
| `tests/api/users.api.spec.ts` | ~64 | Full CRUD + contracts + idempotency |
| `tests/ui/complete-purchase.e2e.spec.ts` | ~3 | End-to-end purchase flow |
| `tests/ui/pageWiseTests/product-listing.spec.ts` | ~9 | Product listing page |
| `tests/ui/pageWiseTests/product-details.spec.ts` | ~14 | Product details page |
| `tests/ui/pageWiseTests/cart.spec.ts` | ~11 | Cart management |
| `tests/ui/pageWiseTests/checkout.spec.ts` | ~11 | Checkout form & confirmation |
| `tests/websocket/users.websocket.spec.ts` | ~8 | WebSocket user events |

### Architecture
```
automation/src/
├── config/env.config.ts        # Local / staging / production URLs
├── fixtures/base.fixture.ts    # pom + userApi injected into every test
├── pages/                      # ProductListingPage, ProductDetailsPage, CartPage, CheckoutPage
├── pom/PageObjectManager.ts    # Central page-object factory
├── testData/                   # Typed API and UI test data
└── utils/                      # UserApiClient, schemaValidator, helpers, logger
```

### Fixtures (available in every test)
```typescript
pom.productListingPage
pom.productDetailsPage
pom.cartPage
pom.checkoutPage

userApi.createUser(data)
userApi.getUsers()
userApi.getUserById(id)
userApi.updateUser(id, data)
userApi.deleteUser(id)
```

### Environment Config
Set `TEST_ENV` env var to target a different environment:
```bash
TEST_ENV=staging API_TOKEN=xxx npm test
```

> See [AUTOMATION.md](AUTOMATION.md) for full documentation.

---

## Test Coverage Summary

### Totals

| Category | Tests |
|----------|-------|
| API (CRUD + Contracts) | ~64 |
| UI E2E | ~3 |
| UI Page-wise | ~45 |
| WebSocket | ~8 |
| **Total** | **~120** |

### API Coverage
- All 5 HTTP methods (GET, POST, PUT, DELETE) tested on both success and error paths
- Duplicate-email conflict (409) covered on POST and PUT
- Malformed and absent UUIDs covered on GET, PUT, DELETE
- Full JSON schema validation on every response using AJV
- Content-Type headers verified on all response types
- Idempotency: repeated GET returns identical data; double-DELETE returns 204 then 404

### UI Coverage
- Complete purchase flow (listing → details → cart → checkout → confirmation)
- Cart persistence across page navigations
- Form validation: required fields, email format, phone format, zip code
- Empty states: empty cart, empty search results
- Search and category filter

### WebSocket Coverage
- Connection established and stays open during API operations
- `userCreated`, `userUpdated`, `userDeleted` events received and schema-validated
- Clean disconnect

### Test Patterns Used
| Tag | Meaning |
|-----|---------|
| `[Positive]` | Happy path / valid data |
| `[Negative]` | Error cases / invalid input |
| `[Data-driven]` | Loop over multiple data sets |
| `[Contract]` | Schema / status-code / header assertion |
| `[Idempotency]` | Repeated operation behaviour |

> See [automation/TEST_COVERAGE_SUMMARY.md](automation/TEST_COVERAGE_SUMMARY.md) for the full per-test breakdown.

---

## Root Scripts Reference

Run from the repo root (`/`):

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build all workspaces |
| `npm run test:api` | Run API tests |
| `npm run test:ui` | Run UI tests |
| `npm run test:websocket` | Run WebSocket tests |
| `npm run test:all` | Run all test categories sequentially |
| `npm run lint` | Lint all workspaces |
| `npm run type-check` | TypeScript check all workspaces |
