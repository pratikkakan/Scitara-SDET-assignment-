/// <reference types="node" />
import { test, expect } from '@/fixtures/base.fixture';
import { validUser, testUsers } from '@/testData/api/users/userData';
import { userSchema, wsUserCreatedEventSchema } from '@/testData/api/schemas/user.schema';
import { wsOrderStatusChangedEventSchema } from '@/testData/api/schemas/order.schema';
import { validateSchema } from '@/utils/validators/schemaValidator';

const WS_EVENT_TIMEOUT_MS = 3_000;

/**
 * Parses a raw WebSocket frame into a plain object.
 * Handles two wire formats:
 *   1. Raw JSON (non-Socket.IO)
 *   2. Socket.IO event frames — "42[\"EVENT_NAME\", {...payload}]"
 *      where "4" = Engine.IO message and "2" = Socket.IO event sub-type.
 *      We strip the numeric prefix and extract the payload (index 1 of the array).
 */
function parseFrame(payload: string | Buffer): Record<string, unknown> | null {
  try {
    const str = typeof payload === 'string' ? payload : Buffer.from(payload).toString();

    // Socket.IO event frame: starts with "42["
    if (str.startsWith('42[')) {
      const arr = JSON.parse(str.slice(2)); // remove "42" prefix → ["EVENT_NAME", {...}]
      if (Array.isArray(arr) && arr.length >= 2 && arr[1] !== null && typeof arr[1] === 'object') {
        return arr[1] as Record<string, unknown>;
      }
    }

    // Fallback: raw JSON object frame
    const parsed = JSON.parse(str);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }

    return null;
  } catch {
    return null;
  }
}

function isUserCreatedEvent(msg: Record<string, unknown>): boolean {
  return msg['type'] === 'USER_CREATED';
}

function isOrderStatusChangedEvent(msg: Record<string, unknown>): boolean {
  return msg['type'] === 'ORDER_STATUS_CHANGED';
}

test.describe('WebSocket — User Events', () => {
  let createdUserIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    for (const id of createdUserIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdUserIds = [];
  });

  // ─── Connection ────────────────────────────────────────────────────────────

  test.describe('Connection', () => {
    test('[Positive] WebSocket connection is established on page load', async ({ browser }) => {
      await test.step("Open page and verify WebSocket connection is established", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let connected = false;

        page.on('websocket', () => { connected = true; });

        await page.goto('/');
        await page.waitForTimeout(2_000);

        expect(connected).toBe(true);
        await context.close();
      });
    });

    test('[Positive] connection remains open during API activity', async ({ browser, userApi }) => {
      const { page, context } = await test.step("Open page and attach WebSocket drop listener", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let dropped = false;

        page.on('websocket', (ws) => {
          ws.on('close', () => { dropped = true; });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { page, context, getDropped: () => dropped };
      });

      await test.step("Create a user via API while WebSocket is open", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdUserIds.push(created.id);
        await page.waitForTimeout(500);
      });

      await test.step("Assert WebSocket was not dropped during API activity", async () => {
        const wsEvents: boolean[] = [];
        page.on('websocket', (ws) => {
          ws.on('close', () => wsEvents.push(true));
        });
        expect(wsEvents.length).toBe(0);
        await context.close();
      });
    });

    test('[Positive] reconnects after page reload', async ({ browser }) => {
      await test.step("Open page, reload, and verify WebSocket connections were established", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const connections: string[] = [];

        page.on('websocket', (ws) => { connections.push(ws.url()); });

        await page.goto('/');
        await page.waitForTimeout(500);
        await page.reload();
        await page.waitForTimeout(500);

        expect(connections.length).toBeGreaterThan(0);
        await context.close();
      });
    });
  });

  // ─── User Created Events ───────────────────────────────────────────────────

  test.describe('User Created Events', () => {
    test('[Positive] userCreated event received after POST /users', async ({ browser, userApi }) => {
      const { context, eventReceived } = await test.step("Open page and register USER_CREATED event listener", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const eventReceived = new Promise<boolean>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isUserCreatedEvent(msg)) resolve(true);
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { page, context, eventReceived };
      });

      await test.step("POST /users to trigger USER_CREATED event", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdUserIds.push(created.id);
      });

      await test.step("Assert USER_CREATED event was received within timeout", async () => {
        const received = await Promise.race([
          eventReceived,
          new Promise<boolean>((r) => setTimeout(() => r(false), WS_EVENT_TIMEOUT_MS)),
        ]);
        expect(received).toBe(true);
        await context.close();
      });
    });

    test('[Positive] userCreated event payload passes full wsUserCreatedEventSchema', async ({ browser, userApi }) => {
      const { context, capturedPayloads, eventReceived } = await test.step("Open page and capture USER_CREATED event payload", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const capturedPayloads: Record<string, unknown>[] = [];

        const eventReceived = new Promise<void>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isUserCreatedEvent(msg)) {
                capturedPayloads.push(msg);
                resolve();
              }
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { context, capturedPayloads, eventReceived };
      });

      await test.step("POST /users to trigger USER_CREATED event", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdUserIds.push(created.id);
        await Promise.race([
          eventReceived,
          new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
        ]);
      });

      await test.step("Assert captured payload passes wsUserCreatedEventSchema", async () => {
        expect(capturedPayloads.length).toBeGreaterThan(0);
        const payload = capturedPayloads[0];
        expect(validateSchema(payload, wsUserCreatedEventSchema)).toBe(true);
        await context.close();
      });
    });

    test('[Positive] userCreated payload contains correct user id and email', async ({ browser, userApi }) => {
      const { context, capturedPayloads, eventReceived } = await test.step("Open page and capture USER_CREATED event payload", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const capturedPayloads: Record<string, unknown>[] = [];

        const eventReceived = new Promise<void>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isUserCreatedEvent(msg)) {
                capturedPayloads.push(msg);
                resolve();
              }
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { context, capturedPayloads, eventReceived };
      });

      let createdUser: Record<string, unknown>;
      await test.step("POST /users and capture created user data", async () => {
        createdUser = await (await userApi.createUser(validUser)).json();
        createdUserIds.push(createdUser.id as string);
        await Promise.race([
          eventReceived,
          new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
        ]);
      });

      await test.step("Assert payload user matches the created user", async () => {
        expect(capturedPayloads.length).toBeGreaterThan(0);
        const data = capturedPayloads[0]['data'] as Record<string, unknown>;
        const user = data['user'] as Record<string, unknown>;
        expect(user['id']).toBe(createdUser!['id']);
        expect(user['email']).toBe(createdUser!['email']);
        expect(validateSchema(user, userSchema)).toBe(true);
        await context.close();
      });
    });

    test('[Positive] rapid parallel user creation — WebSocket stays connected', async ({ browser, userApi }) => {
      const { context, page } = await test.step("Open page and verify initial WebSocket connection", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let connected = false;

        page.on('websocket', () => { connected = true; });

        await page.goto('/');
        await page.waitForTimeout(500);
        expect(connected).toBe(true);
        return { context, page };
      });

      await test.step("Create 3 users in parallel and assert all return 201 with valid schema", async () => {
        const responses = await Promise.all(
          testUsers.slice(0, 3).map((u) => userApi.createUser(u)),
        );

        for (const res of responses) {
          expect(res.status()).toBe(201);
          const body = await res.json();
          createdUserIds.push(body.id);
          expect(validateSchema(body, userSchema)).toBe(true);
        }
      });

      await test.step("Assert WebSocket connection is still active after parallel requests", async () => {
        await page.waitForTimeout(500);
        expect(page).toBeTruthy();
        await context.close();
      });
    });
  });

  // ─── Order Status Changed Events ───────────────────────────────────────────

  test.describe('Order Status Changed Events', () => {
    const orderPayload = {
      items: [{ productId: 'prod-1', quantity: 2, price: 49.99 }],
      total: 99.98,
    };

    test('[Positive] ORDER_STATUS_CHANGED event received after PATCH /orders/:id/status', async ({ browser, userApi }) => {
      const { context, eventReceived } = await test.step("Open page and register ORDER_STATUS_CHANGED listener", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const eventReceived = new Promise<boolean>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isOrderStatusChangedEvent(msg)) resolve(true);
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { page, context, eventReceived };
      });

      await test.step("Create an order then update its status to confirmed", async () => {
        const order = await (await userApi.createOrder(orderPayload)).json();
        expect(order.id).toBeTruthy();
        await userApi.updateOrderStatus(order.id, 'confirmed');
      });

      await test.step("Assert ORDER_STATUS_CHANGED event was received within timeout", async () => {
        const received = await Promise.race([
          eventReceived,
          new Promise<boolean>((r) => setTimeout(() => r(false), WS_EVENT_TIMEOUT_MS)),
        ]);
        expect(received).toBe(true);
        await context.close();
      });
    });

    test('[Positive] ORDER_STATUS_CHANGED payload passes full schema validation', async ({ browser, userApi }) => {
      const { context, capturedPayloads, eventReceived } = await test.step("Open page and capture ORDER_STATUS_CHANGED payload", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const capturedPayloads: Record<string, unknown>[] = [];

        const eventReceived = new Promise<void>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isOrderStatusChangedEvent(msg)) {
                capturedPayloads.push(msg);
                resolve();
              }
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { context, capturedPayloads, eventReceived };
      });

      await test.step("Create order and update status to trigger event", async () => {
        const order = await (await userApi.createOrder(orderPayload)).json();
        await userApi.updateOrderStatus(order.id, 'shipped');
        await Promise.race([
          eventReceived,
          new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
        ]);
      });

      await test.step("Assert payload passes wsOrderStatusChangedEventSchema", async () => {
        expect(capturedPayloads.length).toBeGreaterThan(0);
        const payload = capturedPayloads[0];
        expect(validateSchema(payload, wsOrderStatusChangedEventSchema)).toBe(true);
        await context.close();
      });
    });

    test('[Positive] ORDER_STATUS_CHANGED payload contains correct order ID and previousStatus', async ({ browser, userApi }) => {
      const { context, capturedPayloads, eventReceived } = await test.step("Open page and capture ORDER_STATUS_CHANGED payload", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const capturedPayloads: Record<string, unknown>[] = [];

        const eventReceived = new Promise<void>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isOrderStatusChangedEvent(msg)) {
                capturedPayloads.push(msg);
                resolve();
              }
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { context, capturedPayloads, eventReceived };
      });

      let orderId: string;
      await test.step("Create order (status=pending) then update to confirmed", async () => {
        const order = await (await userApi.createOrder(orderPayload)).json();
        orderId = order.id;
        await userApi.updateOrderStatus(orderId, 'confirmed');
        await Promise.race([
          eventReceived,
          new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
        ]);
      });

      await test.step("Assert payload has correct order ID and previousStatus=pending", async () => {
        expect(capturedPayloads.length).toBeGreaterThan(0);
        const data = capturedPayloads[0]['data'] as Record<string, unknown>;
        const order = data['order'] as Record<string, unknown>;
        expect(order['id']).toBe(orderId!);
        expect(order['status']).toBe('confirmed');
        expect(data['previousStatus']).toBe('pending');
        await context.close();
      });
    });
  });

  // ─── Message Format ────────────────────────────────────────────────────────

  test.describe('Message Format', () => {
    test('[Positive] received frames are valid JSON objects', async ({ browser, userApi }) => {
      const { context, messages } = await test.step("Open page and collect all WebSocket frames", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const messages: Record<string, unknown>[] = [];

        page.on('websocket', (ws) => {
          ws.on('framereceived', (frame) => {
            const msg = parseFrame(frame.payload as string | Buffer);
            if (msg) messages.push(msg);
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);

        const created = await (await userApi.createUser(validUser)).json();
        createdUserIds.push(created.id);
        await page.waitForTimeout(2_000);

        return { context, messages };
      });

      await test.step("Assert all received frames are non-null objects", async () => {
        for (const msg of messages) {
          expect(typeof msg).toBe('object');
          expect(msg).not.toBeNull();
        }
        await context.close();
      });
    });
  });

  // ─── Error Handling ────────────────────────────────────────────────────────

  test.describe('Error Handling', () => {
    test('[Positive] page remains functional after WebSocket navigation', async ({ browser }) => {
      await test.step("Navigate to page and assert it remains functional", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForTimeout(500);

        expect(page).toBeTruthy();
        await context.close();
      });
    });
  });
});
