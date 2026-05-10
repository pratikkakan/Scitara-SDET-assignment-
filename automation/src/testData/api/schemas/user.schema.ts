/**
 * User API schemas for validation
 * Using JSON Schema (AJV compatible) for contract testing
 */

// Base user schema
export const userSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    firstName: { type: "string", minLength: 1, maxLength: 100 },
    lastName: { type: "string", minLength: 1, maxLength: 100 },
    email: { type: "string", format: "email" },
    phone: {
      type: "string",
      pattern: "^\\+?[1-9]\\d{1,14}$|^$", // Optional
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"],
};

// Schema for list of users
export const usersListSchema = {
  type: "array",
  items: userSchema,
  minItems: 0,
};

// Schema for create user request payload
export const createUserPayloadSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 1, maxLength: 100 },
    lastName: { type: "string", minLength: 1, maxLength: 100 },
    email: { type: "string", format: "email" },
    phone: {
      type: "string",
      pattern: "^\\+?[1-9]\\d{1,14}$",
    },
  },
  required: ["firstName", "lastName", "email"],
};

// Schema for update user request payload
export const updateUserPayloadSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 1, maxLength: 100 },
    lastName: { type: "string", minLength: 1, maxLength: 100 },
    email: { type: "string", format: "email" },
    phone: {
      type: "string",
      pattern: "^\\+?[1-9]\\d{1,14}$",
    },
  },
};

// Error response schema - matches backend error envelope
export const errorResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean", enum: [false] },
    error: {
      type: "object",
      properties: {
        message: { type: "string" },
        code: { type: "string" },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: { type: "string" },
              message: { type: "string" },
            },
            required: ["field", "message"],
          },
        },
      },
      required: ["message", "code"],
    },
    timestamp: { type: "string", format: "date-time" },
    path: { type: "string" },
  },
  required: ["success", "error", "timestamp", "path"],
};

// Success response wrapper (for consistency)
export const successResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    status: { type: "number" },
    data: { type: "object" },
  },
  required: ["message", "status"],
  additionalProperties: false,
};

// WebSocket USER_CREATED event payload schema
export const wsUserCreatedEventSchema = {
  type: "object",
  properties: {
    eventId: { type: "string" },
    type: { type: "string", enum: ["USER_CREATED"] },
    occurredAt: { type: "string", format: "date-time" },
    data: {
      type: "object",
      properties: {
        user: userSchema,
      },
      required: ["user"],
    },
  },
  required: ["eventId", "type", "occurredAt", "data"],
};
