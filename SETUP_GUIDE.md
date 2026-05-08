"""
Scitara SDET Assignment - Setup and Execution Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set up Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp automation/.env.example automation/.env
```

### 3. Run All Services

```bash
npm run dev
```

This starts:

- Backend API: http://localhost:3000
- Frontend: http://localhost:5173
- WebSocket: ws://localhost:3001

### 4. Run Tests

```bash
npm run test:all
```

---

## Project Structure

```
scitara-sdet-assignment/
├── backend/            # Node.js + Express REST API
├── frontend/           # React + Vite E-Commerce UI
├── automation/         # Playwright TypeScript Tests
└── .github/workflows/  # CI/CD Configuration
```

---

## Key Features

### ✅ Backend (Node.js + Express)

- RESTful API for user management
- WebSocket support for real-time events
- Input validation with Joi
- Type-safe with TypeScript
- In-memory data storage (can use DB)

### ✅ Frontend (React + Vite)

- E-Commerce product listing
- Shopping cart functionality
- Checkout flow
- Axios HTTP client
- React Router navigation

### ✅ Automation (Playwright)

- API testing with schema validation
- UI E2E testing with Page Object Model
- WebSocket integration testing
- Data-driven test cases
- Multi-browser support
- CI-ready configuration

---

## NPM Scripts

### Development

```bash
npm run dev              # Start all services
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build all workspaces
```

### Testing

```bash
npm run test:all         # Run all tests
npm run test:api         # API tests
npm run test:ui          # UI tests
npm run test:websocket   # WebSocket tests
npm run test:headed      # Show browser
```

### Code Quality

```bash
npm run lint             # Check linting
npm run lint:fix         # Fix lint issues
npm run type-check       # TypeScript validation
```

---

## Architecture Highlights

### 1. Separation of Concerns

- Controllers handle requests
- Services handle business logic
- Validators handle input validation
- Middleware handles cross-cutting concerns

### 2. Type Safety

- Full TypeScript implementation
- Strict mode enabled
- Type definitions for all APIs
- Interfaces for all data structures

### 3. Test Architecture

- Page Object Model for UI tests
- Fixture-based test data
- Schema validation for APIs
- Separate test data from schemas

### 4. Enterprise Patterns

- Middleware-based architecture
- Service layer pattern
- Dependency injection ready
- Error handling standardized

---

## File Organization

### Backend

```
src/
├── index.ts              # Entry point
├── routes/               # API routes
├── controllers/          # Route handlers
├── services/             # Business logic
├── validators/           # Input validation
├── middleware/           # Express middleware
├── data/                 # Data storage
└── types/                # TypeScript types
```

### Frontend

```
src/
├── main.tsx              # React entry
├── pages/                # Page components
├── components/           # Reusable components
├── services/             # API clients
├── hooks/                # Custom hooks
└── types/                # TypeScript types
```

### Automation

```
tests/
├── api/                  # API tests
├── ui/                   # UI tests
└── websocket/            # WebSocket tests

pages/                     # Page objects
fixtures/                  # Test data
schemas/                   # Response schemas
utils/                     # Test utilities
```

---

## How to Extend

### Add New API Endpoint

1. Define type in `backend/src/types/`
2. Create validator in `backend/src/validators/`
3. Create service method in `backend/src/services/`
4. Create controller in `backend/src/controllers/`
5. Add route in `backend/src/routes/`
6. Create test in `automation/tests/api/`

### Add New UI Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Create page object in `automation/pages/`
4. Add tests in `automation/tests/ui/`

### Add New Test Suite

1. Create spec file in appropriate test directory
2. Import fixtures from `automation/fixtures/`
3. Import schemas from `automation/schemas/`
4. Use utilities from `automation/utils/`
5. Follow Page Object Model pattern

---

## CI/CD Ready

Configuration included for:

- GitHub Actions workflows
- Docker containerization
- Test reporting
- Artifact uploads

---

## Support & References

### Documentation

- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
- Automation: [automation/README.md](automation/README.md)

### Technologies

- Node.js: https://nodejs.org/
- Express: https://expressjs.com/
- React: https://react.dev/
- Playwright: https://playwright.dev/
- Vite: https://vitejs.dev/

### Best Practices

- TypeScript: https://www.typescriptlang.org/
- Clean Code: https://clean-code-javascript.com/
- Testing: https://playwright.dev/docs/intro

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different ports in .env
PORT=3001
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm run install:all
```

### TypeScript Errors

```bash
npm run type-check
```

### Test Failures

```bash
npm run test:debug
npm run test:ui-mode
```

---

**Ready to demonstrate your SDET expertise!** 🚀
"""
