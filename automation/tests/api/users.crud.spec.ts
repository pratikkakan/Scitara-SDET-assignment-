import { test, expect } from '@/fixtures/base.fixture';
import {
  validUser,
  validUserMinimal,
  userMissingFirstName,
  userMissingLastName,
  userMissingEmail,
  userInvalidEmail,
  userInvalidPhone,
  userExceedsMaxLength,
  testUsers,
  updateUserData,
  partialUpdateData,
} from '@/testData/api/users/userData';
import { userSchema, usersListSchema, errorResponseSchema } from '@/schemas/user.schema';
import { validateSchema } from '@/utils/validators/schemaValidator';

test.describe('Users API — CRUD Operations', () => {
  let createdIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    for (const id of createdIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdIds = [];
  });

  // ─── POST /users ───────────────────────────────────────────────────────────

  test.describe('POST /users — Create User', () => {
    test('[Positive] creates user with all valid fields → 201 + valid schema', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      const body = await response.json();

      expect(response.status()).toBe(201);
      expect(validateSchema(body, userSchema)).toBe(true);
      expect(body.firstName).toBe(validUser.firstName);
      expect(body.email).toBe(validUser.email);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');

      createdIds.push(body.id);
    });

    test('[Positive] creates user with only required fields → 201 + phone absent', async ({ userApi }) => {
      const response = await userApi.createUser(validUserMinimal);
      const body = await response.json();

      expect(response.status()).toBe(201);
      expect(validateSchema(body, userSchema)).toBe(true);
      expect(body.phone).toBeUndefined();

      createdIds.push(body.id);
    });

    test('[Negative] rejects missing firstName → 400 + error schema', async ({ userApi }) => {
      const response = await userApi.createUser(userMissingFirstName);
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects missing lastName → 400 + error schema', async ({ userApi }) => {
      const response = await userApi.createUser(userMissingLastName);

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('[Negative] rejects missing email → 400 + error schema', async ({ userApi }) => {
      const response = await userApi.createUser(userMissingEmail);
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects invalid email format → 400', async ({ userApi }) => {
      const response = await userApi.createUser(userInvalidEmail);
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects invalid phone format → 400', async ({ userApi }) => {
      const response = await userApi.createUser(userInvalidPhone);

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('[Negative] rejects firstName exceeding max length → 400', async ({ userApi }) => {
      const response = await userApi.createUser(userExceedsMaxLength);

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('[Data-driven] creates all test users successfully', async ({ userApi }) => {
      for (const user of testUsers) {
        const response = await userApi.createUser(user);
        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(validateSchema(body, userSchema)).toBe(true);

        createdIds.push(body.id);
      }

      expect(createdIds.length).toBe(testUsers.length);
    });
  });

  // ─── GET /users ────────────────────────────────────────────────────────────

  test.describe('GET /users — Retrieve All Users', () => {
    test('[Positive] returns 200 with array matching list schema', async ({ userApi }) => {
      const response = await userApi.getUsers();
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(validateSchema(body, usersListSchema)).toBe(true);
    });

    test('[Positive] created user appears in list', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.getUsers();
      const body: any[] = await response.json();

      expect(body.some((u) => u.id === created.id)).toBe(true);
    });

    test('[Positive] every user in list has required fields', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const body: any[] = await (await userApi.getUsers()).json();

      for (const user of body) {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
      }
    });
  });

  // ─── GET /users/:id ────────────────────────────────────────────────────────

  test.describe('GET /users/:id — Retrieve User by ID', () => {
    test('[Positive] returns user matching requested ID → 200 + valid schema', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.getUserById(created.id);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(validateSchema(body, userSchema)).toBe(true);
      expect(body.id).toBe(created.id);
      expect(body.email).toBe(validUser.email);
    });

    test('[Negative] returns 404 for non-existent ID', async ({ userApi }) => {
      const response = await userApi.getUserById('nonexistent-id');
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 400/404 for malformed ID', async ({ userApi }) => {
      const response = await userApi.getUserById('invalid@id#123');

      expect([400, 404]).toContain(response.status());
    });

    test('[Data-driven] each created user is retrievable by ID', async ({ userApi }) => {
      const created: any[] = [];

      for (const user of testUsers.slice(0, 3)) {
        const body = await (await userApi.createUser(user)).json();
        created.push(body);
        createdIds.push(body.id);
      }

      for (const user of created) {
        const response = await userApi.getUserById(user.id);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.id).toBe(user.id);
      }
    });
  });

  // ─── PUT /users/:id ────────────────────────────────────────────────────────

  test.describe('PUT /users/:id — Update User', () => {
    test('[Positive] full update returns 200 + updated data', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.updateUser(created.id, updateUserData);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(validateSchema(body, userSchema)).toBe(true);
      expect(body.firstName).toBe(updateUserData.firstName);
      expect(body.email).toBe(updateUserData.email);
    });

    test('[Positive] partial update preserves unchanged fields', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.updateUser(created.id, partialUpdateData);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.firstName).toBe(partialUpdateData.firstName);
      expect(body.lastName).toBe(validUser.lastName);
      expect(body.email).toBe(validUser.email);
    });

    test('[Negative] rejects update with invalid email → 400', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.updateUser(created.id, { email: 'not-an-email' });

      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('[Negative] returns 404 for non-existent user update', async ({ userApi }) => {
      const response = await userApi.updateUser('nonexistent-id', updateUserData);

      expect(response.status()).toBe(404);
    });

    test('[Data-driven] updates multiple users successfully', async ({ userApi }) => {
      for (const user of testUsers.slice(0, 2)) {
        const created = await (await userApi.createUser(user)).json();
        createdIds.push(created.id);

        const response = await userApi.updateUser(created.id, updateUserData);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.firstName).toBe(updateUserData.firstName);
      }
    });
  });

  // ─── DELETE /users/:id ─────────────────────────────────────────────────────

  test.describe('DELETE /users/:id — Delete User', () => {
    test('[Positive] deletes user and returns 200; subsequent GET returns 404', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();

      const deleteResponse = await userApi.deleteUser(created.id);
      expect(deleteResponse.status()).toBe(200);

      const getResponse = await userApi.getUserById(created.id);
      expect(getResponse.status()).toBe(404);
    });

    test('[Negative] returns 404 when deleting non-existent user', async ({ userApi }) => {
      const response = await userApi.deleteUser('nonexistent-id');

      expect(response.status()).toBe(404);
    });

    test('[Data-driven] deletes multiple users; each verified as 404 after', async ({ userApi }) => {
      const ids: string[] = [];

      for (const user of testUsers.slice(0, 3)) {
        const body = await (await userApi.createUser(user)).json();
        ids.push(body.id);
      }

      for (const id of ids) {
        expect((await userApi.deleteUser(id)).status()).toBe(200);
        expect((await userApi.getUserById(id)).status()).toBe(404);
      }
    });
  });

  // ─── Status Codes + Schema Coverage ────────────────────────────────────────

  test.describe('HTTP Status Codes + Full Schema Coverage', () => {
    test('[Contract] correct status codes for all CRUD operations', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();

      expect((await userApi.getUsers()).status()).toBe(200);
      expect((await userApi.getUserById(created.id)).status()).toBe(200);
      expect((await userApi.updateUser(created.id, updateUserData)).status()).toBe(200);
      expect((await userApi.deleteUser(created.id)).status()).toBe(200);
      expect((await userApi.getUserById(created.id)).status()).toBe(404);
    });

    test('[Contract] all response bodies match their schemas', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(validateSchema(created, userSchema)).toBe(true);
      expect(validateSchema(await (await userApi.getUsers()).json(), usersListSchema)).toBe(true);
      expect(validateSchema(await (await userApi.getUserById(created.id)).json(), userSchema)).toBe(true);
      expect(validateSchema(await (await userApi.updateUser(created.id, updateUserData)).json(), userSchema)).toBe(true);
    });
  });
});
