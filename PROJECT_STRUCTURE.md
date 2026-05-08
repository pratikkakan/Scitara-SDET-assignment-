# 📊 Project Structure Visualization

## Complete Directory Tree

```
scitara-sdet-assignment/
│
├── 📄 package.json                          # Root workspace configuration
├── 📄 README.md                             # Main documentation
├── 📄 SETUP_GUIDE.md                        # Quick start guide
├── 📄 .gitignore                            # Git ignore rules
├── 📄 .eslintrc.json                        # ESLint configuration
├── 📄 docker-compose.yml                    # Docker orchestration
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 test.yml                      # CI/CD pipeline
│
├── 📂 backend/                              # 🔧 Node.js + Express API
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 Dockerfile
│   ├── 📄 .env.example
│   ├── 📄 README.md                         # Backend documentation
│   ├── 📂 dist/                             # Compiled output
│   └── 📂 src/
│       ├── 📄 index.ts                      # Server entry point
│       ├── 📂 config/                       # Configuration files
│       ├── 📂 routes/                       # API route handlers
│       │   └── 📄 users.routes.ts           # User endpoints
│       ├── 📂 controllers/                  # Request handlers
│       │   └── 📄 user.controller.ts        # User controller template
│       ├── 📂 services/                     # Business logic
│       │   └── 📄 user.service.ts           # User service template
│       ├── 📂 validators/                   # Input validation schemas
│       │   └── 📄 user.validator.ts         # User validation
│       ├── 📂 middleware/                   # Express middleware
│       │   ├── 📄 errorHandler.ts           # Error handling
│       │   ├── 📄 requestLogger.ts          # Request logging
│       │   └── 📄 validateRequest.ts        # Validation middleware
│       ├── 📂 data/                         # In-memory storage
│       │   └── 📄 users.data.ts             # User data storage
│       ├── 📂 types/                        # TypeScript interfaces
│       │   └── 📄 user.types.ts             # User types
│       ├── 📂 utils/                        # Helper functions
│       │   └── 📄 logger.ts                 # Logging utility
│       └── 📂 websocket/                    # WebSocket handlers
│           └── 📄 events.handler.ts         # Event handlers
│
├── 📂 frontend/                             # ⚛️ React + Vite
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 tsconfig.node.json
│   ├── 📄 vite.config.ts
│   ├── 📄 Dockerfile
│   ├── 📄 index.html                        # HTML entry point
│   ├── 📄 .env.example
│   ├── 📄 README.md                         # Frontend documentation
│   ├── 📂 public/                           # Static assets
│   └── 📂 src/
│       ├── 📄 main.tsx                      # React entry point
│       ├── 📄 App.tsx                       # Root component
│       ├── 📄 index.css                     # Global styles
│       ├── 📂 pages/                        # Page components
│       │   ├── 📄 ProductListing.tsx        # Product list page
│       │   ├── 📄 ProductDetails.tsx        # Product details page
│       │   ├── 📄 Cart.tsx                  # Shopping cart page
│       │   └── 📄 Checkout.tsx              # Checkout page
│       ├── 📂 components/                   # Reusable components
│       │   ├── 📄 Header.tsx                # Header component
│       │   ├── 📄 ProductCard.tsx           # Product card component
│       │   ├── 📄 CartItem.tsx              # Cart item component
│       │   └── 📄 Footer.tsx                # Footer component
│       ├── 📂 services/                     # API clients & services
│       │   ├── 📄 apiClient.ts              # Axios HTTP client
│       │   ├── 📄 userService.ts            # User API service
│       │   └── 📄 productService.ts         # Product API service
│       ├── 📂 hooks/                        # Custom React hooks
│       │   ├── 📄 useCart.ts                # Cart hook
│       │   ├── 📄 useFetch.ts               # Fetch hook
│       │   └── 📄 useLocalStorage.ts        # Local storage hook
│       ├── 📂 types/                        # TypeScript interfaces
│       │   ├── 📄 user.ts                   # User types
│       │   └── 📄 product.ts                # Product types
│       ├── 📂 utils/                        # Helper functions
│       │   ├── 📄 formatPrice.ts            # Price formatting
│       │   ├── 📄 storage.ts                # Storage utilities
│       │   └── 📄 validators.ts             # Validation functions
│       ├── 📂 styles/                       # Stylesheets
│       │   ├── 📄 components.css            # Component styles
│       │   ├── 📄 pages.css                 # Page styles
│       │   └── 📄 variables.css             # CSS variables
│       └── 📂 data/                         # Mock data
│           └── 📄 products.json             # Product mock data
│
├── 📂 automation/                           # 🧪 Playwright Testing
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 playwright.config.ts              # Playwright configuration
│   ├── 📄 Dockerfile
│   ├── 📄 .env.example
│   ├── 📄 README.md                         # Automation documentation
│   │
│   ├── 📂 tests/                            # Test files
│   │   ├── 📂 api/                          # API tests
│   │   │   ├── 📄 users.spec.ts             # User CRUD tests
│   │   │   └── 📄 validation.spec.ts        # Validation tests
│   │   ├── 📂 ui/                           # UI E2E tests
│   │   │   ├── 📄 productListing.spec.ts    # Product listing tests
│   │   │   ├── 📄 productDetails.spec.ts    # Product details tests
│   │   │   ├── 📄 cart.spec.ts              # Cart functionality tests
│   │   │   └── 📄 checkout.spec.ts          # Checkout flow tests
│   │   └── 📂 websocket/                    # WebSocket tests
│   │       └── 📄 websocket.spec.ts         # WebSocket event tests
│   │
│   ├── 📂 pages/                            # Page Object Model
│   │   ├── 📄 index.ts                      # Barrel export
│   │   ├── 📄 BasePage.ts                   # Base page class
│   │   ├── 📄 ProductListingPage.ts         # Product listing PO
│   │   ├── 📄 CartPage.ts                   # Cart page PO
│   │   └── 📄 CheckoutPage.ts               # Checkout page PO
│   │
│   ├── 📂 utils/                            # Test utilities
│   │   ├── 📄 index.ts                      # Barrel export
│   │   ├── 📄 config.ts                     # Configuration
│   │   ├── 📄 testHelpers.ts                # Common test functions
│   │   └── 📄 schemaValidator.ts            # JSON Schema validation
│   │
│   ├── 📂 fixtures/                         # Test data fixtures
│   │   ├── 📄 index.ts                      # Barrel export
│   │   ├── 📄 userTestData.ts               # User test fixtures
│   │   ├── 📄 productTestData.ts            # Product test fixtures
│   │   └── 📄 cartTestData.ts               # Cart test fixtures
│   │
│   └── 📂 schemas/                          # JSON Schema definitions
│       ├── 📄 index.ts                      # Barrel export
│       ├── 📄 user.schema.ts                # User response schema
│       ├── 📄 product.schema.ts             # Product response schema
│       └── 📄 api.response.schema.ts        # API response schema
```

## Directory Statistics

- **Total Directories**: 40+
- **Total Files**: 80+
- **TypeScript Files**: 55+
- **Configuration Files**: 12
- **Test Files**: 8
- **Documentation Files**: 5

## Key File Purposes

### Configuration Files

- `package.json` - Npm workspace root
- `tsconfig.json` - TypeScript compilation
- `playwright.config.ts` - Test browser automation
- `vite.config.ts` - Frontend build tool
- `.eslintrc.json` - Code linting rules
- `docker-compose.yml` - Container orchestration

### Source Code Files

- `**/src/index.ts` - Application entry points
- `**/src/types/*.ts` - TypeScript type definitions
- `**/src/routes/*.ts` - API route handlers
- `**/src/controllers/*.ts` - Request handling logic
- `**/src/services/*.ts` - Business logic layer

### Test Files

- `**/*.spec.ts` - Playwright test files
- `fixtures/*.ts` - Test data sets
- `schemas/*.ts` - Response validation schemas
- `pages/*.ts` - Page Object Model classes

### Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Quick start instructions
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details
- `automation/README.md` - Testing guide

## Architecture Layers

```
┌─────────────────────────────────────────┐
│          Frontend (React/Vite)          │
├─────────────────────────────────────────┤
│    Backend API (Express/TypeScript)     │
├──────────────┬──────────────────────────┤
│  WebSocket   │   REST API               │
│  (Port 3001) │   (Port 3000)            │
├─────────────────────────────────────────┤
│      In-Memory Data / Mock Database     │
├─────────────────────────────────────────┤
│    Automation Tests (Playwright)        │
│  API │ UI │ WebSocket Integration       │
└─────────────────────────────────────────┘
```

## 🚀 Quick Navigation

### To find...

- **API Endpoints**: `backend/src/routes/`
- **UI Components**: `frontend/src/components/`
- **Test Cases**: `automation/tests/`
- **Type Definitions**: `**/src/types/`
- **Configuration**: Root `package.json` and `*.config.ts` files
- **Documentation**: `README.md` files in each directory

---

**This structure supports enterprise-level quality assurance practices with clear separation of concerns, type safety, and comprehensive testing coverage.**
