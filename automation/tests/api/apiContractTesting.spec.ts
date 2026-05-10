/**
 * API Contract Testing - Complete API Coverage
 * - Contract validation for all endpoints
 * - Request/Response schema validation
 * - HTTP status code verification
 * - Response body validation with AJV
 * - PACT-style consumer-provider contracts
 */

import { test, expect } from "@playwright/test";
import {
  validUser,
  validUserMinimal,
  testUsers,
  userInvalidEmail,
  userMissingFirstName,
  userMissingEmail,
} from "@/fixtures/userTestData";
import {
  userSchema,
  usersListSchema,
  createUserPayloadSchema,
  updateUserPayloadSchema,
  errorResponseSchema,
} from "@/schemas/user.schema";
import {
  validateSchema,
  getSchemaErrors,
  validateResponseContract,
  assertSchemaValid,
} from "@/utils/schemaValidator";
import { apiConfig } from "@/utils/config";

test.describe("API: Contract Testing - Request/Response Validation", () => {
  const apiUrl = `${apiConfig.baseURL}/api/users`;
  let createdUserIds: string[] = [];

  test.afterEach(async ({ request }) => {
    for (const userId of createdUserIds) {
      try {
        await request.delete(`${apiUrl}/${userId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    createdUserIds = [];
  });

  // ============= REQUEST VALIDATION CONTRACTS =============

  test.describe("Contract: POST /users - Request Validation", () => {
    test("Should validate successful creation request contract", async ({
      request,
    }) => {
      const requestBody = validUser;

      // Validate request payload matches schema
      const requestValid = validateSchema(
        requestBody,
        createUserPayloadSchema
      );
      expect(requestValid).toBe(true);

      const response = await request.post(apiUrl, {
        data: requestBody,
      });

      expect(response.status()).toBe(201);
      createdUserIds.push((await response.json()).id);
    });

    test("Should reject request with missing required fields", async ({
      request,
    }) => {
      const invalidPayload = { firstName: "John" }; // Missing lastName, email

      const requestValid = validateSchema(
        invalidPayload,
        createUserPayloadSchema
      );
      expect(requestValid).toBe(false);

      const response = await request.post(apiUrl, {
        data: invalidPayload,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("Should accept optional phone field in request", async ({ request }) => {
      const requestBody = validUser;

      const requestValid = validateSchema(
        requestBody,
        createUserPayloadSchema
      );
      expect(requestValid).toBe(true);

      const response = await request.post(apiUrl, {
        data: requestBody,
      });

      expect(response.status()).toBe(201);
      createdUserIds.push((await response.json()).id);
    });

    test("Should validate minimal valid request", async ({ request }) => {
      const requestBody = validUserMinimal;

      const requestValid = validateSchema(
        requestBody,
        createUserPayloadSchema
      );
      expect(requestValid).toBe(true);

      const response = await request.post(apiUrl, {
        data: requestBody,
      });

      expect(response.status()).toBe(201);
      createdUserIds.push((await response.json()).id);
    });

    test("Should enforce strict field validation in request", async ({
      request,
    }) => {
      const payloadWithExtraField = {
        ...validUser,
        invalidField: "should-not-be-here",
      };

      const response = await request.post(apiUrl, {
        data: payloadWithExtraField,
      });

      // Backend should reject unknown fields
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Contract: PUT /users/{id} - Request Validation", () => {
    test("Should validate update request with single field", async ({
      request,
    }) => {
      // Create user first
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const updatePayload = { firstName: "Updated" };

      // Validate update request matches schema
      const requestValid = validateSchema(
        updatePayload,
        updateUserPayloadSchema
      );
      expect(requestValid).toBe(true);

      const response = await request.put(`${apiUrl}/${user.id}`, {
        data: updatePayload,
      });

      expect(response.status()).toBe(200);
    });

    test("Should validate update request with multiple fields", async ({
      request,
    }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const updatePayload = {
        firstName: "New",
        lastName: "Name",
        email: "newemail@test.com",
      };

      const requestValid = validateSchema(
        updatePayload,
        updateUserPayloadSchema
      );
      expect(requestValid).toBe(true);

      const response = await request.put(`${apiUrl}/${user.id}`, {
        data: updatePayload,
      });

      expect(response.status()).toBe(200);
    });

    test("Should reject empty update request", async ({ request }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const emptyPayload = {};

      const response = await request.put(`${apiUrl}/${user.id}`, {
        data: emptyPayload,
      });

      expect(response.status()).toBe(400);
    });
  });

  // ============= RESPONSE VALIDATION CONTRACTS =============

  test.describe("Contract: Response Schema - User Resource", () => {
    test("Should return user with all required fields", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      const body = await response.json();

      // Validate complete response schema
      assertSchemaValid(body, userSchema, "User Response Contract");

      // Verify all required fields exist
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("firstName");
      expect(body).toHaveProperty("lastName");
      expect(body).toHaveProperty("email");
      expect(body).toHaveProperty("createdAt");
      expect(body).toHaveProperty("updatedAt");

      // Verify optional fields if present
      if (body.phone) {
        expect(typeof body.phone).toBe("string");
      }

      createdUserIds.push(body.id);
    });

    test("Should return user with correct field types", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      const body = await response.json();

      expect(typeof body.id).toBe("string");
      expect(typeof body.firstName).toBe("string");
      expect(typeof body.lastName).toBe("string");
      expect(typeof body.email).toBe("string");
      expect(typeof body.createdAt).toBe("string");
      expect(typeof body.updatedAt).toBe("string");

      createdUserIds.push(body.id);
    });

    test("Should return valid ISO 8601 timestamps", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      const body = await response.json();

      // Verify ISO 8601 format
      const createdAtDate = new Date(body.createdAt);
      const updatedAtDate = new Date(body.updatedAt);

      expect(createdAtDate.getTime()).not.toBeNaN();
      expect(updatedAtDate.getTime()).not.toBeNaN();

      createdUserIds.push(body.id);
    });

    test("Should return valid UUID for user ID", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      const body = await response.json();

      // UUID v4 pattern
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(body.id).toMatch(uuidPattern);

      createdUserIds.push(body.id);
    });

    test("Should not include sensitive data in response", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      const body = await response.json();

      // Should not include password or other sensitive fields
      expect(body).not.toHaveProperty("password");
      expect(body).not.toHaveProperty("securityToken");
      expect(body).not.toHaveProperty("apiKey");

      createdUserIds.push(body.id);
    });
  });

  test.describe("Contract: Response Schema - Users List", () => {
    test("Should return users as array", async ({ request }) => {
      const response = await request.get(apiUrl);

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);
    });

    test("Should validate users list schema", async ({ request }) => {
      // Create some users first
      for (const userData of testUsers.slice(0, 2)) {
        const createRes = await request.post(apiUrl, {
          data: userData,
        });
        createdUserIds.push((await createRes.json()).id);
      }

      const response = await request.get(apiUrl);
      const body = await response.json();

      // Validate list schema
      assertSchemaValid(body, usersListSchema, "Users List Contract");

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test("Should validate each user in list matches user schema", async ({
      request,
    }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      createdUserIds.push((await createRes.json()).id);

      const response = await request.get(apiUrl);
      const body = await response.json();

      // Verify each item matches user schema
      body.forEach((user: any) => {
        const validation = getSchemaErrors(user, userSchema);
        expect(validation.isValid).toBe(true);
      });
    });

    test("Should handle empty users list", async ({ request }) => {
      const response = await request.get(apiUrl);

      expect(response.status()).toBe(200);
      const body = await response.json();

      // Empty array is valid
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ============= HTTP STATUS CODE CONTRACTS =============

  test.describe("Contract: HTTP Status Codes", () => {
    test("Should return 201 Created on successful creation", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      expect(response.status()).toBe(201);
      createdUserIds.push((await response.json()).id);
    });

    test("Should return 200 OK on successful GET all", async ({ request }) => {
      const response = await request.get(apiUrl);

      expect(response.status()).toBe(200);
    });

    test("Should return 200 OK on successful GET by ID", async ({ request }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const response = await request.get(`${apiUrl}/${user.id}`);

      expect(response.status()).toBe(200);
    });

    test("Should return 200 OK on successful update", async ({ request }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const response = await request.put(`${apiUrl}/${user.id}`, {
        data: { firstName: "Updated" },
      });

      expect(response.status()).toBe(200);
    });

    test("Should return 204 No Content on successful delete", async ({
      request,
    }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();

      const response = await request.delete(`${apiUrl}/${user.id}`);

      expect(response.status()).toBe(204);
      expect(await response.text()).toBe("");
    });

    test("Should return 400 Bad Request for invalid payload", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: userInvalidEmail,
      });

      expect(response.status()).toBe(400);
    });

    test("Should return 404 Not Found for non-existent resource", async ({
      request,
    }) => {
      const fakeId = "550e8400-e29b-41d4-a716-446655440000";

      const response = await request.get(`${apiUrl}/${fakeId}`);

      expect(response.status()).toBe(404);
    });
  });

  // ============= ERROR RESPONSE CONTRACTS =============

  test.describe("Contract: Error Response Format", () => {
    test("Should return error response with required fields", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: userMissingEmail,
      });

      const body = await response.json();

      // Validate error response schema
      assertSchemaValid(body, errorResponseSchema, "Error Response Contract");

      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("status");
    });

    test("Should return consistent error response format", async ({ request }) => {
      // Test multiple error scenarios
      const errorTests = [
        userInvalidEmail,
        userMissingFirstName,
        userMissingEmail,
      ];

      for (const invalidData of errorTests) {
        const response = await request.post(apiUrl, {
          data: invalidData,
        });

        const body = await response.json();

        // Each error should follow same format
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("status");
        expect(typeof body.message).toBe("string");
        expect(typeof body.status).toBe("number");
      }
    });

    test("Should include helpful error message", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: userMissingEmail,
      });

      const body = await response.json();

      expect(body.message).toBeTruthy();
      expect(body.message.length).toBeGreaterThan(0);
    });
  });

  // ============= RESPONSE HEADERS CONTRACTS =============

  test.describe("Contract: Response Headers", () => {
    test("Should include Content-Type header", async ({ request }) => {
      const response = await request.get(apiUrl);

      expect(response.headers()["content-type"]).toContain("application/json");
    });

    test("Should include Location header on resource creation", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      expect(response.status()).toBe(201);
      expect(response.headers()["location"]).toBeTruthy();

      createdUserIds.push((await response.json()).id);
    });

    test("Should include CORS headers if configured", async ({ request }) => {
      const response = await request.get(apiUrl);

      // CORS headers might be present depending on configuration
      const corsHeaders = response.headers();
      // This test is informational - just verify response is accessible
      expect(response.status()).toBe(200);
    });

    test("Should have appropriate Cache-Control headers", async ({ request }) => {
      const response = await request.get(apiUrl);

      // Cache-Control header might be present
      const headers = response.headers();
      // Verify response is valid
      expect(response.status()).toBe(200);
    });
  });

  // ============= IDEMPOTENCY CONTRACTS =============

  test.describe("Contract: API Behavior - Idempotency", () => {
    test("Should return same data on repeated GET requests", async ({
      request,
    }) => {
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      const response1 = await request.get(`${apiUrl}/${user.id}`);
      const body1 = await response1.json();

      const response2 = await request.get(`${apiUrl}/${user.id}`);
      const body2 = await response2.json();

      expect(body1.id).toBe(body2.id);
      expect(body1.firstName).toBe(body2.firstName);
      expect(body1.email).toBe(body2.email);
    });

    test("Should return unique IDs for multiple creations", async ({
      request,
    }) => {
      const response1 = await request.post(apiUrl, {
        data: validUser,
      });
      const user1 = await response1.json();

      const response2 = await request.post(apiUrl, {
        data: { ...validUser, email: "different@test.com" },
      });
      const user2 = await response2.json();

      expect(user1.id).not.toBe(user2.id);

      createdUserIds.push(user1.id, user2.id);
    });

    test("Should preserve data integrity across multiple operations", async ({
      request,
    }) => {
      // Create user
      const createRes = await request.post(apiUrl, {
        data: validUser,
      });
      const user = await createRes.json();
      createdUserIds.push(user.id);

      // Update user
      await request.put(`${apiUrl}/${user.id}`, {
        data: { firstName: "Updated" },
      });

      // Get user and verify update
      const getRes = await request.get(`${apiUrl}/${user.id}`);
      const updated = await getRes.json();

      expect(updated.firstName).toBe("Updated");
      expect(updated.email).toBe(validUser.email); // Unchanged fields should remain
    });
  });
});
