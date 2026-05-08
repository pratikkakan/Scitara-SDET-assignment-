# Backend API

TypeScript + Express backend for user management with:

- in-memory JSON seed data
- UUID-based user IDs
- Zod validation
- centralized error handling
- reusable response helpers
- async-ready service/store layers

## Quick Start

```bash
cd backend
npm install --workspaces=false
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The API runs on `http://localhost:3000` by default.

## Endpoints

Primary routes:

```text
POST   /users
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

Compatibility routes are also mounted at `/api/users`.

## Project Structure

```text
src/
├── app.ts
├── index.ts
├── controllers/
├── data/
├── middleware/
├── routes/
├── services/
├── types/
├── utils/
└── validators/
```

## Sample Request

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "+15555550123"
  }'
```

## Response Behavior

- `201 Created` for successful user creation
- `200 OK` for reads and updates
- `204 No Content` for deletes
- `400 Bad Request` for validation or malformed JSON
- `404 Not Found` when a user does not exist
- `409 Conflict` when email uniqueness is violated

Validation and application errors use a consistent response shape:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email must be valid"
      }
    ]
  },
  "timestamp": "2026-05-08T14:59:42.068Z",
  "path": "/users"
}
```

## Seed Data

The in-memory store is initialized from [src/data/users.json](/Users/pratikkakan/Desktop/Assignment/Scitara-SDET-assignment-/backend/src/data/users.json).
