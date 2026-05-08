# Backend API Service - Architecture & Implementation Guide

## Overview

The backend is a Node.js/Express REST API providing user management functionality with WebSocket support for real-time events.

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Server runs on: `http://localhost:3000`
WebSocket on: `ws://localhost:3001`

## Directory Structure

```
src/
├── index.ts              # Server entry point
├── config/               # Configuration management
│   └── database.ts      # DB connection config
├── routes/              # Express route handlers
│   └── users.routes.ts  # User endpoints
├── controllers/         # Request handling logic
│   └── user.controller.ts
├── services/            # Business logic
│   └── user.service.ts
├── validators/          # Input validation (Joi schemas)
│   └── user.validator.ts
├── middleware/          # Custom middleware
│   ├── errorHandler.ts
│   ├── requestLogger.ts
│   └── validateRequest.ts
├── data/                # In-memory data storage
│   └── users.data.ts
├── types/               # TypeScript interfaces
│   └── user.types.ts
├── utils/               # Helper functions
│   └── logger.ts
└── websocket/           # WebSocket handlers
    └── events.handler.ts
```

## Key Responsibilities

### Controllers

- Handle HTTP requests
- Validate input (using middleware)
- Call services
- Return appropriate responses

```typescript
export async function createUser(req: Request, res: Response) {
  const service = new UserService();
  const user = await service.create(req.body);
  res.status(201).json(user);
}
```

### Services

- Implement business logic
- Interact with data layer
- Handle validations
- Emit WebSocket events

```typescript
export class UserService {
  create(userData: ICreateUserRequest): Promise<IUser> {
    // Business logic here
  }
}
```

### Validators

- Define Joi schemas
- Handle validation errors
- Provide clear error messages

### Middleware

- Request logging
- CORS handling
- Error handling
- Authentication (if needed)

## Available Scripts

```bash
npm run dev              # Start with nodemon
npm run build            # Compile TypeScript
npm run start            # Run compiled server
npm run lint             # Run ESLint
npm run lint:fix         # Fix lint issues
npm run type-check       # Check TypeScript types
```

## API Endpoints

All endpoints follow REST conventions:

```
POST   /api/users          - Create user
GET    /api/users          - List all users
GET    /api/users/:id      - Get user by ID
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user
```

## Error Handling

Consistent error response format:

```json
{
  "success": false,
  "error": "Email already exists",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

HTTP Status Codes:

- 200: OK
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## WebSocket Implementation

### Server-Side Setup

```typescript
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    // Handle incoming message
  });
});
```

### Events Emitted

- `userCreated`: Emitted when new user is created
- `userUpdated`: Emitted when user is updated
- `userDeleted`: Emitted when user is deleted

## Environment Variables

See `.env.example`:

```
NODE_ENV=development
PORT=3000
WS_PORT=3001
LOG_LEVEL=info
```

## Type Safety

All request/response interfaces defined in `src/types/`:

```typescript
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Next Steps

1. Implement route handlers in `routes/`
2. Add service methods in `services/`
3. Implement data persistence in `data/`
4. Add authentication middleware
5. Configure WebSocket event broadcasting
