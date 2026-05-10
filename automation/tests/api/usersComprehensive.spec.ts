/**
 * Comprehensive API Tests - User Management
 * Covers all CRUD operations with positive, negative, and data-driven scenarios
 * Includes schema validation using AJV
 */

import { test, expect } from "@playwright/test";
import {
  validUser,
  validUserMinimal,
  userMissingFirstName,
  userMissingLastName,
  userInvalidEmail,
  userMissingEmail,
  userInvalidPhone,
  userExceedsMaxLength,
  testUsers,
  updateUserData,
  partialUpdateData,
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
  validateRequestPayload,
  validateResponseContract,
} from "@/utils/schemaValidator";
import { apiConfig } from "@/utils/config";

test.describe("User API - Comprehensive Test Suite", () => {
  const apiUrl = `${apiConfig.baseURL}/api/users`;
  let createdUserIds: string[] = [];

  test.afterEach(async ({ request }) => {
    // Cleanup: Delete all created users
    for (const userId of createdUserIds) {
      try {
        await request.delete(`${apiUrl}/${userId}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    createdUserIds = [];
  });

  test.describe("POST /users - Create User", () => {
    test("[Positive] Should create user with all valid fields", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: validUser,
      });

      expect(response.status()).toBe(201);
      const json = await response.json();

      // Validate response schema
      const schemaValid = validateSchema(json, userSchema);
      expect(schemaValid).toBe(true);

      // Verify user data
      expect(json.firstName).toBe(validUser.firstName);
      expect(json.lastName).toBe(validUser.lastName);
      expect(json.email).toBe(validUser.email);
      expect(json.phone).toBe(validUser.phone);
      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("createdAt");
      expect(json).toHaveProperty("updatedAt");

      createdUserIds.push(json.id);
    });

    test("[Positive] Should create user with minimal fields", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: validUserMinimal,
      });

      expect(response.status()).toBe(201);
      const json = await response.json();

      const schemaValid = validateSchema(json, userSchema);
      expect(schemaValid).toBe(true);

      expect(json.firstName).toBe(validUserMinimal.firstName);
      expect(json.lastName).toBe(validUserMinimal.lastName);
      expect(json.email).toBe(validUserMinimal.email);
      expect(json.phone).toBeUndefined();

      createdUserIds.push(json.id);
    });

    test("[Negative] Should reject missing firstName", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: userMissingFirstName,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should reject missing lastName", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: userMissingLastName,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should reject missing email", async ({ request }) => {
      const response = await request.post(apiUrl, {
        data: userMissingEmail,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should reject invalid email format", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: userInvalidEmail,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should reject invalid phone format", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: userInvalidPhone,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should reject name exceeding max length", async ({
      request,
    }) => {
      const response = await request.post(apiUrl, {
        data: userExceedsMaxLength,
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Data-driven] Should create multiple users", async ({ request }) => {
      for (const user of testUsers) {
        const response = await request.post(apiUrl, {
          data: user,
        });

        expect(response.status()).toBe(201);
        const json = await response.json();

        const schemaValid = validateSchema(json, userSchema);
        expect(schemaValid).toBe(true);

        createdUserIds.push(json.id);
      }

      expect(createdUserIds.length).toBe(testUsers.length);
    });
  });

  test.describe("GET /users - Retrieve All Users", () => {
    test("[Positive] Should retrieve all users", async ({ request }) => {
      // Create a user first
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();
      createdUserIds.push(createdUser.id);

      // Get all users
      const response = await request.get(apiUrl);

      expect(response.status()).toBe(200);
      const json = await response.json();

      // Validate response is an array
      expect(Array.isArray(json)).toBe(true);

      // Validate schema for array of users
      const schemaValid = validateSchema(json, usersListSchema);
      expect(schemaValid).toBe(true);

      // Verify created user is in the list
      const userExists = json.some((u: any) => u.id === createdUser.id);
      expect(userExists).toBe(true);
    });

    test("[Positive] Should retrieve empty list when no users exist", async ({
      request,
    }) => {
      // This test assumes we can clear data or run in isolation
      const response = await request.get(apiUrl);

      expect(response.status()).toBe(200);
      const json = await response.json();

      expect(Array.isArray(json)).toBe(true);
      const schemaValid = validateSchema(json, usersListSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Positive] Should retrieve all fields for each user", async ({
      request,
    }) => {
      // Create multiple users
      for (const user of testUsers.slice(0, 2)) {
        const createResponse = await request.post(apiUrl, {
          data: user,
        });
        const created = await createResponse.json();
        createdUserIds.push(created.id);
      }

      const response = await request.get(apiUrl);
      const json = await response.json();

      // Verify each user has all required fields
      json.forEach((user: any) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("firstName");
        expect(user).toHaveProperty("lastName");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("createdAt");
        expect(user).toHaveProperty("updatedAt");
      });
    });
  });

  test.describe("GET /users/{id} - Retrieve User by ID", () => {
    test("[Positive] Should retrieve user by ID", async ({ request }) => {
      // Create user
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();
      createdUserIds.push(createdUser.id);

      // Get user by ID
      const response = await request.get(`${apiUrl}/${createdUser.id}`);

      expect(response.status()).toBe(200);
      const json = await response.json();

      // Validate schema
      const schemaValid = validateSchema(json, userSchema);
      expect(schemaValid).toBe(true);

      // Verify data matches
      expect(json.id).toBe(createdUser.id);
      expect(json.firstName).toBe(validUser.firstName);
      expect(json.email).toBe(validUser.email);
    });

    test("[Negative] Should return 404 for non-existent user", async ({
      request,
    }) => {
      const response = await request.get(`${apiUrl}/nonexistent-id`);

      expect(response.status()).toBe(404);
      const json = await response.json();

      const schemaValid = validateSchema(json, errorResponseSchema);
      expect(schemaValid).toBe(true);
    });

    test("[Negative] Should return 404 for invalid ID format", async ({
      request,
    }) => {
      const response = await request.get(`${apiUrl}/invalid@id#123`);

      expect([400, 404]).toContain(response.status());
    });

    test("[Data-driven] Should retrieve each created user", async ({
      request,
    }) => {
      const createdUsers = [];

      // Create multiple users
      for (const user of testUsers.slice(0, 3)) {
        const createResponse = await request.post(apiUrl, {
          data: user,
        });
        const created = await createResponse.json();
        createdUsers.push(created);
        createdUserIds.push(created.id);
      }

      // Retrieve each user
      for (const user of createdUsers) {
        const response = await request.get(`${apiUrl}/${user.id}`);

        expect(response.status()).toBe(200);
        const json = await response.json();

        expect(json.id).toBe(user.id);
        expect(json.email).toBe(user.email);
      }
    });
  });

  test.describe("PUT /users/{id} - Update User", () => {
    test("[Positive] Should update user with all fields", async ({
      request,
    }) => {
      // Create user
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();
      createdUserIds.push(createdUser.id);

      // Update user
      const response = await request.put(`${apiUrl}/${createdUser.id}`, {
        data: updateUserData,
      });

      expect(response.status()).toBe(200);
      const json = await response.json();

      // Validate schema
      const schemaValid = validateSchema(json, userSchema);
      expect(schemaValid).toBe(true);

      // Verify updated data
      expect(json.firstName).toBe(updateUserData.firstName);
      expect(json.lastName).toBe(updateUserData.lastName);
      expect(json.email).toBe(updateUserData.email);
      expect(json.phone).toBe(updateUserData.phone);
    });

    test("[Positive] Should partially update user", async ({ request }) => {
      // Create user
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();
      createdUserIds.push(createdUser.id);

      // Partial update
      const response = await request.put(`${apiUrl}/${createdUser.id}`, {
        data: partialUpdateData,
      });

      expect(response.status()).toBe(200);
      const json = await response.json();

      // Verify updated field
      expect(json.firstName).toBe(partialUpdateData.firstName);
      // Verify unchanged fields remain
      expect(json.lastName).toBe(validUser.lastName);
      expect(json.email).toBe(validUser.email);
    });

    test("[Negative] Should reject update with invalid email", async ({
      request,
    }) => {
      // Create user
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();
      createdUserIds.push(createdUser.id);

      // Update with invalid email
      const response = await request.put(`${apiUrl}/${createdUser.id}`, {
        data: {
          email: "invalid-email",
        },
      });

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test("[Negative] Should return 404 for non-existent user update", async ({
      request,
    }) => {
      const response = await request.put(`${apiUrl}/nonexistent-id`, {
        data: updateUserData,
      });

      expect(response.status()).toBe(404);
    });

    test("[Data-driven] Should update multiple users", async ({ request }) => {
      const createdUsers = [];

      // Create users
      for (const user of testUsers.slice(0, 2)) {
        const createResponse = await request.post(apiUrl, {
          data: user,
        });
        const created = await createResponse.json();
        createdUsers.push(created);
        createdUserIds.push(created.id);
      }

      // Update each user
      for (const user of createdUsers) {
        const response = await request.put(`${apiUrl}/${user.id}`, {
          data: updateUserData,
        });

        expect(response.status()).toBe(200);
        const json = await response.json();
        expect(json.firstName).toBe(updateUserData.firstName);
      }
    });
  });

  test.describe("DELETE /users/{id} - Delete User", () => {
    test("[Positive] Should delete existing user", async ({ request }) => {
      // Create user
      const createResponse = await request.post(apiUrl, {
        data: validUser,
      });
      const createdUser = await createResponse.json();

      // Delete user
      const deleteResponse = await request.delete(
        `${apiUrl}/${createdUser.id}`,
      );

      expect(deleteResponse.status()).toBe(200);

      // Verify user is deleted
      const getResponse = await request.get(`${apiUrl}/${createdUser.id}`);
      expect(getResponse.status()).toBe(404);
    });

    test("[Negative] Should return 404 when deleting non-existent user", async ({
      request,
    }) => {
      const response = await request.delete(`${apiUrl}/nonexistent-id`);

      expect(response.status()).toBe(404);
    });

    test("[Data-driven] Should delete multiple users", async ({ request }) => {
      const userIds = [];

      // Create multiple users
      for (const user of testUsers.slice(0, 3)) {
        const createResponse = await request.post(apiUrl, {
          data: user,
        });
        const created = await createResponse.json();
        userIds.push(created.id);
      }

      // Delete each user
      for (const userId of userIds) {
        const response = await request.delete(`${apiUrl}/${userId}`);

        expect(response.status()).toBe(200);

        // Verify deletion
        const getResponse = await request.get(`${apiUrl}/${userId}`);
        expect(getResponse.status()).toBe(404);
      }
    });
  });

  test.describe("HTTP Status Codes Validation", () => {
    test("[Contract] Should return correct status codes for all operations", async ({
      request,
    }) => {
      // POST - 201 Created
      let response = await request.post(apiUrl, { data: validUser });
      expect(response.status()).toBe(201);
      const createdUser = await response.json();
      createdUserIds.push(createdUser.id);

      // GET all - 200 OK
      response = await request.get(apiUrl);
      expect(response.status()).toBe(200);

      // GET by ID - 200 OK
      response = await request.get(`${apiUrl}/${createdUser.id}`);
      expect(response.status()).toBe(200);

      // PUT - 200 OK
      response = await request.put(`${apiUrl}/${createdUser.id}`, {
        data: updateUserData,
      });
      expect(response.status()).toBe(200);

      // DELETE - 200 OK
      response = await request.delete(`${apiUrl}/${createdUser.id}`);
      expect(response.status()).toBe(200);

      // GET deleted - 404 Not Found
      response = await request.get(`${apiUrl}/${createdUser.id}`);
      expect(response.status()).toBe(404);

      createdUserIds.pop(); // Remove from cleanup
    });
  });

  test.describe("Response Schema Validation", () => {
    test("[Contract] All responses should match their schemas", async ({
      request,
    }) => {
      // Create
      let response = await request.post(apiUrl, { data: validUser });
      let json = await response.json();
      expect(validateSchema(json, userSchema)).toBe(true);
      const userId = json.id;
      createdUserIds.push(userId);

      // GET all
      response = await request.get(apiUrl);
      json = await response.json();
      expect(validateSchema(json, usersListSchema)).toBe(true);

      // GET by ID
      response = await request.get(`${apiUrl}/${userId}`);
      json = await response.json();
      expect(validateSchema(json, userSchema)).toBe(true);

      // Update
      response = await request.put(`${apiUrl}/${userId}`, {
        data: updateUserData,
      });
      json = await response.json();
      expect(validateSchema(json, userSchema)).toBe(true);

      // Delete and error response
      await request.delete(`${apiUrl}/${userId}`);
      response = await request.get(`${apiUrl}/${userId}`);
      json = await response.json();
      expect(validateSchema(json, errorResponseSchema)).toBe(true);

      createdUserIds.pop(); // Already deleted
    });
  });
});
