# Backend - User Management REST API

## Overview
The backend is a Node.js Express application built with TypeScript that provides a REST API for user management. It includes WebSocket support for real-time communication and follows a layered architecture with controllers, services, validators, and middleware.

## Technology Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js 4.18.2
- **Validation:** Zod for schema validation
- **Real-time:** Socket.IO 4.8.1
- **Utilities:** UUID, CORS, dotenv

## Project Structure
```
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Server entry point
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── validators/            # Input validation schemas
│   ├── types/                 # TypeScript type definitions
│   ├── data/                  # Data storage/models
│   ├── utils/                 # Utility functions
│   └── websocket/             # Socket.IO event handlers
├── dist/                      # Compiled JavaScript output
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── Dockerfile                 # Docker configuration
└── .env.example               # Environment variables template
```

## API Endpoints

### Core Endpoints
- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint (returns status and timestamp)

### User Management Endpoints
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /api/users` - Alternative users endpoint (same as /users)

### WebSocket Support
- Socket.IO available at `/socket.io`
- Real-time event-driven communication

## Key Features
- **RESTful API Design** - Standard REST endpoints for CRUD operations
- **Input Validation** - Zod schemas for request validation
- **Error Handling** - Centralized error handler middleware
- **CORS Support** - Cross-origin resource sharing enabled
- **WebSocket Integration** - Real-time communication via Socket.IO
- **TypeScript** - Full type safety across codebase
- **Request Middleware** - Validation and async error handling

## Architecture Layers
1. **Routes** - Define API endpoints
2. **Controllers** - Handle incoming requests
3. **Services** - Business logic and data operations
4. **Validators** - Input validation using Zod schemas
5. **Middleware** - Request/response handling (error, validation, 404)
6. **WebSocket** - Event-driven real-time communication

## Getting Started

### Installation
```bash
cd backend
npm install
```

### Development
```bash
npm run dev          # Run with hot reload (uses tsx watch)
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

### Production
```bash
npm run build        # Compile TypeScript to JavaScript
npm start            # Start compiled server
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- Other service configurations as needed

## Development Scripts
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled application
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting errors automatically
- `npm run type-check` - Verify TypeScript types

## Docker
A Dockerfile is included for containerization:
```bash
docker build -t backend .
docker run -p 3000:3000 backend
```

## Dependencies
- **cors** ^2.8.5 - Cross-origin resource sharing
- **dotenv** ^16.3.1 - Environment variables
- **express** ^4.18.2 - Web framework
- **socket.io** ^4.8.1 - WebSocket communication
- **uuid** ^9.0.1 - UUID generation
- **zod** ^3.25.76 - Schema validation

## Response Format
All API responses follow a consistent JSON format with appropriate HTTP status codes:
- `200 OK` - Successful GET, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Error Handling
The backend includes centralized error handling middleware that:
- Catches validation errors from Zod
- Handles application errors
- Returns consistent error responses
- Logs errors appropriately
- Handles 404 Not Found routes
