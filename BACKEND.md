# Backend — User Management REST API

## Overview
Node.js/Express/TypeScript REST API providing CRUD operations for user management. In-memory data store, Zod validation, Socket.IO for real-time events, and centralised error handling.

## Technology Stack
- **Runtime:** Node.js ≥ 18 with TypeScript
- **Framework:** Express.js 4.18.2
- **Validation:** Zod
- **Real-time:** Socket.IO 4.8.1
- **Utilities:** UUID, CORS, dotenv

## Project Structure
```
backend/
├── src/
│   ├── app.ts                     # Express app setup, routes, middleware wiring
│   ├── index.ts                   # Server entry point (port binding)
│   ├── controllers/
│   │   └── user.controller.ts     # Request handlers for all user endpoints
│   ├── routes/
│   │   └── users.routes.ts        # Route definitions (mounted at /users and /api/users)
│   ├── services/
│   │   └── user.service.ts        # Business logic and data operations
│   ├── middleware/
│   │   ├── asyncHandler.ts        # Wraps async controllers for error propagation
│   │   ├── authMiddleware.ts      # Bearer token authentication guard
│   │   ├── errorHandler.ts        # Centralised error response formatting
│   │   ├── notFoundHandler.ts     # 404 catch-all handler
│   │   └── validateRequest.ts     # Zod schema validation (body / params)
│   ├── validators/
│   │   └── user.validator.ts      # createUserSchema, updateUserSchema, userIdParamSchema
│   ├── data/
│   │   ├── userStore.ts           # In-memory user store with CRUD helpers
│   │   └── users.json             # Seed data loaded on startup
│   ├── types/
│   │   ├── user.types.ts          # User interface definitions
│   │   └── api.types.ts           # Generic API response types
│   ├── utils/
│   │   ├── appError.ts            # Custom AppError class with status codes
│   │   └── responseHandlers.ts    # Typed response helpers (sendCreated, sendOk, etc.)
│   └── websocket/
│       ├── socketServer.ts        # Socket.IO server initialisation
│       ├── userEvents.ts          # Handlers that emit user CRUD events
│       ├── events.ts              # Event name constants
│       └── eventEmitter.ts        # Internal event bus
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## API Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/` | API info (name, version, available endpoints) | 200 |
| GET | `/health` | Health check `{ status: "ok", timestamp }` | 200 |
| GET | `/users` | List all users | 200 |
| GET | `/users/:id` | Get user by UUID | 200 / 400 / 404 |
| POST | `/users` | Create user | 201 / 400 / 409 |
| PUT | `/users/:id` | Update user (any subset of fields) | 200 / 400 / 404 / 409 |
| DELETE | `/users/:id` | Delete user | 204 / 400 / 404 |
| * | `/api/users[/:id]` | Alias for `/users[/:id]` — same behaviour | — |

> **Auth:** `/users` and `/api/users` routes require a `Authorization: Bearer <token>` header when `API_TOKEN` is set. `GET /` and `GET /health` are always public.

## Request / Response Contracts

### Create User — `POST /users`
```json
// Request (required: firstName, lastName, email | optional: phone)
{ "firstName": "Jane", "lastName": "Doe", "email": "jane@example.com", "phone": "+1234567890" }

// 201 Created
{ "id": "<uuid>", "firstName": "Jane", "lastName": "Doe", "email": "jane@example.com",
  "createdAt": "<ISO8601>", "updatedAt": "<ISO8601>" }
```

### Error format
```json
{ "error": { "code": "EMAIL_ALREADY_EXISTS", "message": "A user with that email already exists." } }
```
Error codes: `VALIDATION_ERROR` · `INVALID_ID` · `USER_NOT_FOUND` · `EMAIL_ALREADY_EXISTS`

## HTTP Status Codes
| Code | When |
|------|------|
| 200 | Successful GET or PUT |
| 201 | User created (POST) |
| 204 | User deleted (no body) |
| 400 | Validation error or malformed UUID |
| 404 | User not found |
| 409 | Duplicate email on POST or PUT |
| 500 | Unhandled server error |

## Getting Started

### Install & Run (Development)
```bash
cd backend
npm install
npm run dev          # Hot-reload via tsx watch
```

### Production
```bash
npm run build        # Compile TypeScript → dist/
npm start            # Run compiled output
```

### Environment Variables
Copy `.env.example` to `.env`:
```
PORT=3000
NODE_ENV=development
API_TOKEN=your-secret-token    # Omit or leave empty to disable auth
```

### Docker
```bash
docker build -t backend .
docker run -p 3000:3000 --env-file .env backend
```

## Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with auto-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run type-check` | TypeScript type validation |
