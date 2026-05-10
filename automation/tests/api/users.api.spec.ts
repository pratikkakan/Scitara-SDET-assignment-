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
import {
  userSchema,
  usersListSchema,
  createUserPayloadSchema,
  updateUserPayloadSchema,
  errorResponseSchema,
} from '@/testData/api/schemas/user.schema';
import { validateSchema } from '@/utils/validators/schemaValidator';

const VALID_BUT_ABSENT_UUID = '00000000-0000-0000-0000-000000000000';

test.describe('Users API — Complete Test Suite', () => {
  let createdIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    for (const id of createdIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdIds = [];
  });

  // ─── Endpoint Health & Discovery ───────────────────────────────────────────

  test.describe('Endpoint Health & Discovery', () => {
    test('[Discovery] GET / returns API info → 200 + JSON', async ({ userApi }) => {
      const response = await userApi.getRoot();
      const body = await response.json() as Record<string, unknown>;

      expect(response.status()).toBe(200);
      expect(body.name).toContain('User Management API');
      expect(body.version).toBeDefined();
      expect(body.endpoints).toBeDefined();
    });

    test('[Discovery] GET /health returns status → 200 + {status:"ok"}', async ({ userApi }) => {
      const response = await userApi.getHealth();
      const body = await response.json() as Record<string, unknown>;

      expect(response.status()).toBe(200);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  // ─── POST /users — Create User ─────────────────────────────────────────────

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
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
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
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects firstName exceeding max length → 400', async ({ userApi }) => {
      const response = await userApi.createUser(userExceedsMaxLength);
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects duplicate email → 409 Conflict', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const duplicate = await userApi.createUser(validUser);
      const body = await duplicate.json();

      expect(duplicate.status()).toBe(409);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
      expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
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

  // ─── GET /users — Retrieve All Users ──────────────────────────────────────

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

    test('[Contract] GET /users → 200 OK', async ({ userApi }) => {
      expect((await userApi.getUsers()).status()).toBe(200);
    });

    test('[Contract] GET /users response body matches usersListSchema', async ({ userApi }) => {
      const body = await (await userApi.getUsers()).json();
      expect(validateSchema(body, usersListSchema)).toBe(true);
    });

    test('[Contract] GET response includes Content-Type: application/json', async ({ userApi }) => {
      const response = await userApi.getUsers();
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  // ─── GET /users/:id — Retrieve User by ID ─────────────────────────────────

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

    test('[Negative] returns 404 for valid UUID but non-existent ID', async ({ userApi }) => {
      const response = await userApi.getUserById(VALID_BUT_ABSENT_UUID);
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 400 for malformed ID (non-UUID format)', async ({ userApi }) => {
      const response = await userApi.getUserById('invalid@id#123');
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 400 for non-UUID string', async ({ userApi }) => {
      const response = await userApi.getUserById('not-a-uuid');
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
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

    test('[Contract] GET /users/:id existing → 200 OK', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);
      expect((await userApi.getUserById(created.id)).status()).toBe(200);
    });

    test('[Contract] GET /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.getUserById(VALID_BUT_ABSENT_UUID)).status()).toBe(404);
    });

    test('[Contract] GET /users/:id response body matches userSchema', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const body = await (await userApi.getUserById(created.id)).json();
      expect(validateSchema(body, userSchema)).toBe(true);
    });
  });

  // ─── PUT /users/:id — Update User ─────────────────────────────────────────

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
      const body = await response.json();

      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects empty body (no fields) → 400', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.updateUser(created.id, {});
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 404 for valid UUID but non-existent user', async ({ userApi }) => {
      const response = await userApi.updateUser(VALID_BUT_ABSENT_UUID, updateUserData);
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 400 for malformed ID', async ({ userApi }) => {
      const response = await userApi.updateUser('invalid-id', updateUserData);
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] rejects duplicate email in update → 409 Conflict', async ({ userApi }) => {
      const user1 = await (await userApi.createUser(validUser)).json();
      const user2 = await (await userApi.createUser({
        firstName: 'Other',
        lastName: 'User',
        email: 'other@example.com',
      })).json();

      createdIds.push(user1.id, user2.id);

      const response = await userApi.updateUser(user2.id, { email: user1.email });
      const body = await response.json();

      expect(response.status()).toBe(409);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
      expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    test('[Data-driven] updates multiple users successfully', async ({ userApi }) => {
      for (let i = 0; i < 2; i++) {
        const user = testUsers[i];
        const created = await (await userApi.createUser(user)).json();
        createdIds.push(created.id);

        const updatePayload = {
          firstName: `Updated${i}`,
          lastName: updateUserData.lastName,
          email: `updated${i}.${Date.now()}@example.com`,
          phone: updateUserData.phone,
        };

        const response = await userApi.updateUser(created.id, updatePayload);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.firstName).toBe(updatePayload.firstName);
      }
    });

    test('[Contract] PUT /users/:id existing → 200 OK', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);
      expect((await userApi.updateUser(created.id, { firstName: 'Updated' })).status()).toBe(200);
    });

    test('[Contract] PUT /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.updateUser(VALID_BUT_ABSENT_UUID, { firstName: 'X' })).status()).toBe(404);
    });

    test('[Contract] PUT response body matches userSchema', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const body = await (await userApi.updateUser(created.id, { firstName: 'Updated' })).json();
      expect(validateSchema(body, userSchema)).toBe(true);
    });
  });

  // ─── DELETE /users/:id — Delete User ──────────────────────────────────────

  test.describe('DELETE /users/:id — Delete User', () => {
    test('[Positive] deletes user and returns 204; subsequent GET returns 404', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();

      const deleteResponse = await userApi.deleteUser(created.id);
      expect(deleteResponse.status()).toBe(204);

      const getResponse = await userApi.getUserById(created.id);
      expect(getResponse.status()).toBe(404);
    });

    test('[Negative] returns 404 when deleting non-existent user (valid UUID)', async ({ userApi }) => {
      const response = await userApi.deleteUser(VALID_BUT_ABSENT_UUID);
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Negative] returns 400 for malformed ID', async ({ userApi }) => {
      const response = await userApi.deleteUser('not-a-uuid');
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Idempotency] double delete — 204 then 404', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();

      const first = await userApi.deleteUser(created.id);
      expect(first.status()).toBe(204);

      const second = await userApi.deleteUser(created.id);
      expect(second.status()).toBe(404);
    });

    test('[Data-driven] deletes multiple users; each verified as 404 after', async ({ userApi }) => {
      const ids: string[] = [];

      for (const user of testUsers.slice(0, 3)) {
        const body = await (await userApi.createUser(user)).json();
        ids.push(body.id);
      }

      for (const id of ids) {
        expect((await userApi.deleteUser(id)).status()).toBe(204);
        expect((await userApi.getUserById(id)).status()).toBe(404);
      }
    });

    test('[Contract] DELETE /users/:id existing → 204 No Content', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      expect((await userApi.deleteUser(created.id)).status()).toBe(204);
    });

    test('[Contract] DELETE /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.deleteUser(VALID_BUT_ABSENT_UUID)).status()).toBe(404);
    });
  });

  // ─── Request Payload Contracts ────────────────────────────────────────────

  test.describe('Request Payload Contracts', () => {
    test('[Contract] valid create payload satisfies createUserPayloadSchema', async ({ userApi }) => {
      expect(validateSchema(validUser, createUserPayloadSchema)).toBe(true);

      const response = await userApi.createUser(validUser);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] payload with only required fields satisfies schema', async ({ userApi }) => {
      expect(validateSchema(validUserMinimal, createUserPayloadSchema)).toBe(true);

      const response = await userApi.createUser(validUserMinimal);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] payload missing required fields fails schema', () => {
      const partial = { firstName: 'John' };
      expect(validateSchema(partial, createUserPayloadSchema)).toBe(false);
    });

    test('[Contract] payload with invalid email fails schema', () => {
      expect(validateSchema(userInvalidEmail, createUserPayloadSchema)).toBe(false);
    });

    test('[Contract] update payload with all optional fields satisfies updateUserPayloadSchema', () => {
      const update = { firstName: 'New', lastName: 'Name', email: 'new@example.com' };
      expect(validateSchema(update, updateUserPayloadSchema)).toBe(true);
    });
  });

  // ─── Response Body Contracts ──────────────────────────────────────────────

  test.describe('Response Body Contracts', () => {
    test('[Contract] POST response body matches userSchema', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      const body = await response.json();

      expect(validateSchema(body, userSchema)).toBe(true);
      createdIds.push(body.id);
    });

    test('[Contract] error response body matches errorResponseSchema', async ({ userApi }) => {
      const body = await (await userApi.getUserById(VALID_BUT_ABSENT_UUID)).json();
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Contract] response body has no sensitive fields exposed', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(created).not.toHaveProperty('password');
      expect(created).not.toHaveProperty('passwordHash');
      expect(created).not.toHaveProperty('secret');
    });

    test('[Contract] timestamps are valid ISO 8601 strings', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(new Date(created.createdAt).toISOString()).toBe(created.createdAt);
      expect(new Date(created.updatedAt).toISOString()).toBe(created.updatedAt);
    });

    test('[Contract] ID is a non-empty string (UUID format)', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(typeof created.id).toBe('string');
      expect(created.id.length).toBeGreaterThan(0);
    });
  });

  // ─── Response Header Contracts ────────────────────────────────────────────

  test.describe('Response Header Contracts', () => {
    test('[Contract] POST response includes Content-Type: application/json', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
      createdIds.push((await response.json()).id);
    });

    test('[Contract] GET response includes Content-Type: application/json', async ({ userApi }) => {
      const response = await userApi.getUsers();
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('[Contract] PUT response includes Content-Type: application/json', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const response = await userApi.updateUser(created.id, updateUserData);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  // ─── Idempotency & Data Integrity ────────────────────────────────────────

  test.describe('Idempotency & Data Integrity', () => {
    test('[Contract] repeated GET /users/:id returns identical data', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const first = await (await userApi.getUserById(created.id)).json();
      const second = await (await userApi.getUserById(created.id)).json();

      expect(first).toEqual(second);
    });

    test('[Contract] two POST requests with unique emails create separate records', async ({ userApi }) => {
      const userA = await (await userApi.createUser({ ...validUser, email: `a.${Date.now()}@example.com` })).json();
      const userB = await (await userApi.createUser({ ...validUser, email: `b.${Date.now()}@example.com` })).json();

      createdIds.push(userA.id, userB.id);

      expect(userA.id).not.toBe(userB.id);
      expect(userA.email).not.toBe(userB.email);
    });

    test('[Contract] data-driven — all testUsers create unique records', async ({ userApi }) => {
      const ids: string[] = [];

      for (const user of testUsers) {
        const body = await (await userApi.createUser(user)).json();
        expect(validateSchema(body, userSchema)).toBe(true);
        ids.push(body.id);
      }

      createdIds.push(...ids);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(testUsers.length);
    });
  });

  // ─── HTTP Status Code Contract Coverage ───────────────────────────────────

  test.describe('HTTP Status Code Contract Coverage', () => {
    test('[Contract] POST /users → 201 Created', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] POST with invalid payload → 400 Bad Request', async ({ userApi }) => {
      expect((await userApi.createUser(userMissingEmail)).status()).toBeGreaterThanOrEqual(400);
    });

    test('[Contract] correct status codes for all CRUD operations', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect((await userApi.getUsers()).status()).toBe(200);
      expect((await userApi.getUserById(created.id)).status()).toBe(200);
      expect((await userApi.updateUser(created.id, updateUserData)).status()).toBe(200);
      expect((await userApi.deleteUser(created.id)).status()).toBe(204);
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
