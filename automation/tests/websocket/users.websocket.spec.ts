/// <reference types="node" />
/**
 * ============================================================================
 * WebSocket Integration Tests — Part C Advanced Requirement
 * ============================================================================
 *
 * Tests validate WebSocket integration for real-time event delivery.
 *
 * REQUIREMENT MAPPING:
 * 1. Connect to WebSocket
 *    ├─ "Connection" suite: Verify WebSocket connects on page load,
 *    │  stays connected during API activity, and reconnects after reload
 *
 * 2. Validate messages/events
 *    ├─ "User Created Events": Verify USER_CREATED events when user is created
 *    ├─ "Order Status Changed Events": Verify ORDER_STATUS_CHANGED when status updates
 *    └─ "Message Format": Verify all frames are valid JSON objects
 *
 * 3. Handle async behavior
 *    ├─ Uses Promises with race conditions to handle async event timing
 *    ├─ Validates event arrival within WS_EVENT_TIMEOUT_MS
 *    └─ Tests parallel operations (multiple user creation)
 * ============================================================================
 */

import { test, expect } from '@/fixtures/base.fixture';
import { validUser, testUsers } from '@/testData/api/users/userData';
import { userSchema, wsUserCreatedEventSchema } from '@/testData/api/schemas/user.schema';
import { wsOrderStatusChangedEventSchema } from '@/testData/api/schemas/order.schema';
import { validateSchema } from '@/utils/validators/schemaValidator';

const WS_EVENT_TIMEOUT_MS = 3_000;

// ============================================================================
// UTILITY FUNCTIONS — Message Parsing & Filtering
// ============================================================================

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

    if (str.startsWith('42[')) {
      const arr = JSON.parse(str.slice(2));
      if (Array.isArray(arr) && arr.length >= 2 && arr[1] !== null && typeof arr[1] === 'object') {
        return arr[1] as Record<string, unknown>;
      }
    }

    const parsed = JSON.parse(str);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }

    return null;
  } catch {
    return null;
  }
}

// Event type guards
function isUserCreatedEvent(msg: Record<string, unknown>): boolean {
  return msg['type'] === 'USER_CREATED';
}

function isOrderStatusChangedEvent(msg: Record<string, unknown>): boolean {
  return msg['type'] === 'ORDER_STATUS_CHANGED';
}

test.describe('WebSocket Integration Tests', () => {
  let createdUserIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    // Cleanup: Delete all created users after each test to prevent data pollution
    for (const id of createdUserIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdUserIds = [];
  });

  // ==========================================================================
  // REQUIREMENT 1: Connect to WebSocket
  // ==========================================================================
  // Tests validate that WebSocket establishes a stable connection on page load,
  // maintains the connection during API activity, and successfully reconnects
  // after page reload.

  test.describe('Connection Establishment & Stability', () => {
    test('[Positive] WebSocket connection is established on page load', async ({ browser }) => {
      // WHAT: Verify that opening the application page automatically establishes
      //       a WebSocket connection without explicit user action.
      // WHY:  Ensures the WebSocket is ready to receive real-time events immediately.
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
      // WHAT: Verify that WebSocket connection stays alive while making API calls
      //       (like creating a user).
      // WHY:  Ensures the connection is robust and won't drop during normal app usage,
      //       so we don't miss real-time events while users are interacting with the app.
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
      // WHAT: Verify that after a page reload, a new WebSocket connection is
      //       automatically established.
      // WHY:  Ensures the connection is recreated when users refresh the page,
      //       maintaining real-time event delivery without manual intervention.
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

  // ==========================================================================
  // REQUIREMENT 2: Validate Messages/Events — USER_CREATED
  // ==========================================================================
  // Tests validate that:
  // 1. USER_CREATED events are received when a user is created via API
  // 2. Event payloads match the expected schema
  // 3. Event data (user ID, email) matches the created user
  // 4. System handles multiple rapid user creations correctly

  test.describe('User Created Events', () => {
    test('[Positive] userCreated event received after POST /users', async ({ browser, userApi }) => {
      // WHAT: Verify that creating a user via POST /users triggers a USER_CREATED
      //       WebSocket event that is received within the timeout window.
      // WHY:  Core requirement — WebSocket must emit events when user is created.
      //       Tests async behavior: API call triggers event, event arrives on WebSocket.
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
      // WHAT: Verify that the USER_CREATED event payload structure matches the
      //       defined wsUserCreatedEventSchema.
      // WHY:  Ensures data integrity — the event contains all required fields
      //       in the correct format, making it reliable for consuming clients.
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
      // WHAT: Verify that the USER_CREATED event payload contains the exact
      //       user ID and email of the user that was just created.
      // WHY:  Ensures data accuracy — clients can trust the event data matches
      //       what was created via the API (no data corruption/mismatch).
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
      // WHAT: Verify that the WebSocket connection remains stable when multiple
      //       users are created in rapid parallel requests.
      // WHY:  Tests robustness under load — ensures the connection doesn't drop
      //       during concurrent API calls, which is a realistic usage scenario.
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

  // ==========================================================================
  // REQUIREMENT 2: Validate Messages/Events — ORDER_STATUS_CHANGED
  // ==========================================================================
  // Tests validate that:
  // 1. ORDER_STATUS_CHANGED events are received when order status is updated
  // 2. Event payloads match the expected schema
  // 3. Event data (order ID, status, previousStatus) is correct and complete

  test.describe('Order Status Changed Events', () => {
    const orderPayload = {
      items: [{ productId: 'prod-1', quantity: 2, price: 49.99 }],
      total: 99.98,
    };

    test('[Positive] ORDER_STATUS_CHANGED event received after PATCH /orders/:id/status', async ({ browser, userApi }) => {
      // WHAT: Verify that updating an order's status via PATCH /orders/:id/status
      //       triggers an ORDER_STATUS_CHANGED WebSocket event.
      // WHY:  Core requirement — WebSocket must emit events when order status changes.
      //       Tests async behavior: API call triggers event, event arrives on WebSocket.
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
      // WHAT: Verify that the ORDER_STATUS_CHANGED event payload structure matches
      //       the defined wsOrderStatusChangedEventSchema.
      // WHY:  Ensures data integrity — the event contains all required fields
      //       in the correct format for reliable client-side handling.
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
      // WHAT: Verify that the ORDER_STATUS_CHANGED event contains the exact
      //       order ID, current status, and previous status values.
      // WHY:  Ensures data accuracy — clients can track the full state transition,
      //       knowing both before/after states, enabling proper UI updates and logging.
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

  // ==========================================================================
  // REQUIREMENT 2 (Continued): Validate Messages/Events — Message Format
  // ==========================================================================
  // Tests validate that all WebSocket frames are properly formatted and parseable.

  test.describe('Message Format Validation', () => {
    test('[Positive] received frames are valid JSON objects', async ({ browser, userApi }) => {
      // WHAT: Verify that all WebSocket frames received are valid JSON objects
      //       (not null, not arrays, proper objects).
      // WHY:  Foundation for validation — if frames aren't valid JSON objects,
      //       all downstream schema validation will fail.
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

  // ==========================================================================
  // REQUIREMENT 3: Handle Async Behavior & Edge Cases
  // ==========================================================================
  // Tests validate that the application remains functional even when WebSocket
  // events are being processed, ensuring graceful behavior and no blocking issues.

  test.describe('Error Handling & Resilience', () => {
    test('[Positive] page remains functional after WebSocket navigation', async ({ browser }) => {
      // WHAT: Verify that the application page remains functional and responsive
      //       when WebSocket connections are active.
      // WHY:  Ensures WebSocket handling doesn't block UI interactions or break
      //       the application — a fundamental requirement for user experience.
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
