/**
 * Sample API test template
 */

import { test, expect } from "@playwright/test";
import { validUser } from "@/fixtures/userTestData";
import { apiConfig } from "@/utils/config";

test.describe("User API Tests - CRUD Operations", () => {
  const apiUrl = `${apiConfig.baseURL}/api/users`;

  test("POST /users - Create user successfully", async ({ request }) => {
    const response = await request.post(apiUrl, {
      data: validUser,
    });

    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json).toHaveProperty("id");
    expect(json.email).toBe(validUser.email);
  });

  test("GET /users - Retrieve all users", async ({ request }) => {
    const response = await request.get(apiUrl);

    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);
  });

  test("GET /users/{id} - Retrieve specific user", async ({ request }) => {
    // First create a user
    const createResponse = await request.post(apiUrl, {
      data: validUser,
    });
    const user = await createResponse.json();

    // Then fetch it
    const getResponse = await request.get(`${apiUrl}/${user.id}`);
    expect(getResponse.status()).toBe(200);

    const fetchedUser = await getResponse.json();
    expect(fetchedUser.id).toBe(user.id);
  });

  test("PUT /users/{id} - Update user", async ({ request }) => {
    // Create user
    const createResponse = await request.post(apiUrl, {
      data: validUser,
    });
    const user = await createResponse.json();

    // Update user
    const updateData = { firstName: "Updated" };
    const updateResponse = await request.put(`${apiUrl}/${user.id}`, {
      data: updateData,
    });

    expect(updateResponse.status()).toBe(200);
    const updatedUser = await updateResponse.json();
    expect(updatedUser.firstName).toBe("Updated");
  });

  test("DELETE /users/{id} - Delete user", async ({ request }) => {
    // Create user
    const createResponse = await request.post(apiUrl, {
      data: validUser,
    });
    const user = await createResponse.json();

    // Delete user
    const deleteResponse = await request.delete(`${apiUrl}/${user.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify deleted
    const getResponse = await request.get(`${apiUrl}/${user.id}`);
    expect(getResponse.status()).toBe(404);
  });
});
