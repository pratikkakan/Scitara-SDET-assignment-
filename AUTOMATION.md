# Automation — Playwright Test Suite

## Overview
Playwright/TypeScript test suite covering the backend REST API (CRUD + contract), e-commerce UI (page-wise + full E2E), and WebSocket events. Built on the Page Object Model (POM) pattern with custom fixtures, typed test data, and AJV schema validation.

## Technology Stack
- **Framework:** Playwright 1.40.0
- **Language:** TypeScript 5.3.3
- **Schema Validation:** AJV 8 + ajv-formats
- **Reporters:** HTML, JSON, JUnit (list to stdout)

## Project Structure
```
automation/
├── tests/
│   ├── api/
│   │   └── users.api.spec.ts              # Full API suite (CRUD + contracts, ~64 tests)
│   ├── ui/
│   │   ├── complete-purchase.e2e.spec.ts  # End-to-end purchase flow (~3 scenarios)
│   │   └── pageWiseTests/
│   │       ├── product-listing.spec.ts    # Product listing page (~9 tests)
│   │       ├── product-details.spec.ts    # Product details page (~14 tests)
│   │       ├── cart.spec.ts               # Cart management (~11 tests)
│   │       └── checkout.spec.ts           # Checkout form & confirmation (~11 tests)
│   └── websocket/
│       └── users.websocket.spec.ts        # WebSocket user events (~8 tests)
├── src/
│   ├── config/
│   │   └── env.config.ts                  # Environment config (local/staging/production)
│   ├── fixtures/
│   │   ├── base.fixture.ts                # Extends Playwright test with pom + userApi fixtures
│   │   └── index.ts                       # Re-exports
│   ├── pages/
│   │   ├── base/
│   │   │   └── BasePage.ts                # Shared page helpers
│   │   ├── components/
│   │   │   └── CartBadgeComponent.ts      # Cart badge count component
│   │   ├── ProductListingPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── index.ts
│   ├── pom/
│   │   └── PageObjectManager.ts           # Central POM factory used in tests via fixture
│   ├── testData/
│   │   ├── api/
│   │   │   ├── schemas/
│   │   │   │   ├── user.schema.ts         # AJV schemas: userSchema, usersListSchema, errorResponseSchema, …
│   │   │   │   └── index.ts
│   │   │   └── users/
│   │   │       └── userData.ts            # validUser, testUsers, updateUserData, invalid* fixtures
│   │   └── ui/
│   │       ├── checkout/
│   │       │   └── checkoutData.ts        # validCheckout, invalidCheckoutData
│   │       └── products/
│   │           └── productData.ts         # testProducts, singleProduct, multipleProducts
│   └── utils/
│       ├── api/
│       │   ├── UserApiClient.ts           # Typed wrapper around Playwright APIRequestContext
│       │   └── endpoints.ts               # Endpoint path constants
│       ├── helpers/
│       │   ├── dataGenerator.ts           # Random test-data generators
│       │   ├── retryHelper.ts             # Retry logic for flaky operations
│       │   └── waitHelpers.ts             # Custom wait utilities
│       ├── validators/
│       │   └── schemaValidator.ts         # validateSchema / assertSchemaValid (AJV)
│       ├── logger.ts                      # Test-step logger
│       └── index.ts
├── playwright.config.ts                   # Playwright configuration
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## Test Categories

### API Tests (`tests/api/users.api.spec.ts`)
Single consolidated file covering all endpoints and contracts. Tests are grouped by `test.describe` blocks and use `test.step` for structured step reporting.

| Group | Tests |
|-------|-------|
| Endpoint Health & Discovery | GET / and GET /health |
| POST /users — Create User | Positive, negative, data-driven, duplicate email |
| GET /users — Retrieve All | Schema, content-type, created user appears |
| GET /users/:id — Retrieve by ID | Positive, 404, 400 malformed ID, data-driven |
| PUT /users/:id — Update User | Full/partial update, invalid email, empty body, duplicate email |
| DELETE /users/:id | 204 + post-delete 404, double-delete, data-driven |
| Request Payload Contracts | createUserPayloadSchema, updateUserPayloadSchema |
| Response Body Contracts | userSchema, errorResponseSchema, ISO timestamps, no sensitive fields |
| Response Header Contracts | Content-Type: application/json for POST / GET / PUT |
| Idempotency & Data Integrity | Repeated GET identical, unique POSTs create separate records |
| HTTP Status Code Coverage | Full status-code matrix across all operations |

### UI Tests (`tests/ui/`)

#### E2E Flow (`complete-purchase.e2e.spec.ts`)
Full purchase lifecycle from product listing → product details → cart → checkout → confirmation, using multiple products with custom quantities.

#### Page-wise Tests (`pageWiseTests/`)

**product-listing.spec.ts** — navigate, products load, add to cart, cart badge increments, navigate to details, search, filter by category.

**product-details.spec.ts** — product info display, quantity increase/decrease, add-to-cart, cart badge, back navigation, cart persists.

**cart.spec.ts** — empty state, item appears after add, quantity update, item removal, remove all, price summary (subtotal/tax/shipping/total).

**checkout.spec.ts** — form fill, validation errors (missing required fields, invalid email/phone/zip), successful order submission, order confirmation display.

### WebSocket Tests (`tests/websocket/users.websocket.spec.ts`)
- Connection established on page load
- Connection remains open during API activity
- `userCreated` event received after `POST /users`
- `userUpdated` event received after `PUT /users/:id`
- `userDeleted` event received after `DELETE /users/:id`
- Events contain correct payload (validated against `userSchema`)
- Clean disconnect

## POM Architecture

### Fixtures (`src/fixtures/base.fixture.ts`)
Extends Playwright's `test` with two fixtures injected into every test function:

```typescript
pom     // PageObjectManager — access all page objects
userApi // UserApiClient     — typed API request methods
```

### PageObjectManager (`src/pom/PageObjectManager.ts`)
Central factory providing lazy access to page objects:
```typescript
pom.productListingPage
pom.productDetailsPage
pom.cartPage
pom.checkoutPage
```

### UserApiClient (`src/utils/api/UserApiClient.ts`)
Typed wrapper over `APIRequestContext`:
```typescript
userApi.createUser(data)          // POST /users
userApi.getUsers()                // GET /users
userApi.getUserById(id)           // GET /users/:id
userApi.updateUser(id, data)      // PUT /users/:id
userApi.deleteUser(id)            // DELETE /users/:id
userApi.getRoot()                 // GET /
userApi.getHealth()               // GET /health
```

### Schema Validation (`src/utils/validators/schemaValidator.ts`)
```typescript
validateSchema(data, schema)        // → boolean
assertSchemaValid(data, schema)     // throws on invalid
```

Schemas used: `userSchema`, `usersListSchema`, `createUserPayloadSchema`, `updateUserPayloadSchema`, `errorResponseSchema`.

## Environment Configuration (`src/config/env.config.ts`)
Set `TEST_ENV` to switch between environments:

| `TEST_ENV` | API Base URL | UI Base URL |
|------------|-------------|------------|
| `local` (default) | http://localhost:3000 | http://localhost:5173 |
| `staging` | https://api.staging.example.com | https://staging.example.com |
| `production` | https://api.example.com | https://example.com |

Set `API_TOKEN` if the backend has auth enabled.

## Running Tests

### Prerequisites
Backend and frontend must be running (or let Playwright start them via `webServer` in the config).

```bash
# From repo root — start backend + frontend
npm run dev:backend
npm run dev:frontend
```

### Run Tests
```bash
cd automation

npm test                          # All tests
npm run test:api                  # API tests only
npm run test:ui                   # UI tests only
npm run test:websocket            # WebSocket tests only

npm run test:headed               # Show browser window
npm run test:debug                # Playwright debug mode
npm run test:ui-mode              # Interactive UI test runner
npm run test:report               # Open last HTML report
```

### Tag Filtering
```bash
TAGS="@E2E Positive" npx playwright test   # Run tests tagged with @E2E Positive
```

### CI
```bash
CI=true npm test   # Headless, 2 retries, 1 worker, forbid .only
```

## Playwright Config Highlights (`playwright.config.ts`)
- **Browser:** Chromium only by default (Firefox/Safari projects commented out)
- **Trace:** `on` for every test (inspect via `npx playwright show-report`)
- **Video:** `on` for every test
- **Screenshot:** on failure only
- **Retries:** 2 in CI, 0 locally
- **webServer:** auto-starts backend (`npm run start --workspace=backend`) and frontend (`npm run dev --workspace=frontend`) when not already running

## Test Data (`src/testData/`)

### API (`testData/api/users/userData.ts`)
| Export | Purpose |
|--------|---------|
| `validUser` | Full valid user payload |
| `validUserMinimal` | Only required fields (no phone) |
| `testUsers` | Array of 5 distinct users for data-driven tests |
| `updateUserData` | Full update payload |
| `partialUpdateData` | Partial update payload (firstName only) |
| `userMissing*` | Payloads with each required field removed |
| `userInvalid*` | Payloads with invalid email / phone format |
| `userExceedsMaxLength` | firstName beyond max length |

### UI (`testData/ui/`)
| Export | Purpose |
|--------|---------|
| `validCheckout` | Complete valid checkout form data |
| `singleProduct` | Single product (id + quantity) |
| `multipleProducts` | Array of products for E2E cart flow |
| `testProducts` | Full product test data set |

## Test Naming Convention
```
[Positive]     — happy path / valid data
[Negative]     — error cases / invalid input
[Data-driven]  — loop over multiple data sets
[Contract]     — schema / status-code / header assertions
[Idempotency]  — repeated operation behaviour
```
