# Test Coverage Summary

## Total Test Count

| Suite | File | Tests |
|-------|------|-------|
| API | `tests/api/users.api.spec.ts` | ~64 |
| UI — E2E | `tests/ui/complete-purchase.e2e.spec.ts` | ~3 |
| UI — Product Listing | `tests/ui/pageWiseTests/product-listing.spec.ts` | ~9 |
| UI — Product Details | `tests/ui/pageWiseTests/product-details.spec.ts` | ~14 |
| UI — Cart | `tests/ui/pageWiseTests/cart.spec.ts` | ~11 |
| UI — Checkout | `tests/ui/pageWiseTests/checkout.spec.ts` | ~11 |
| WebSocket | `tests/websocket/users.websocket.spec.ts` | ~8 |
| **Total** | | **~120** |

---

## API Test Coverage (`users.api.spec.ts`)

### Endpoint Health & Discovery
- GET `/` returns 200 with API name, version, endpoints object
- GET `/health` returns 200 with `{ status: "ok", timestamp }`

### POST /users — Create User
- [Positive] All valid fields → 201, response matches `userSchema`
- [Positive] Only required fields → 201, `phone` absent in response
- [Negative] Missing `firstName` → 400 + `errorResponseSchema`
- [Negative] Missing `lastName` → 400 + `errorResponseSchema`
- [Negative] Missing `email` → 400 + `errorResponseSchema`
- [Negative] Invalid email format → 400
- [Negative] Invalid phone format → 400
- [Negative] `firstName` exceeds max length → 400
- [Negative] Duplicate email → 409, `error.code === "EMAIL_ALREADY_EXISTS"`
- [Data-driven] All 5 `testUsers` created successfully → 201 each

### GET /users — Retrieve All Users
- [Positive] Returns 200 with array matching `usersListSchema`
- [Positive] Created user appears in list
- [Positive] Every user object has required fields (id, firstName, lastName, email, createdAt, updatedAt)
- [Contract] 200 OK status
- [Contract] Response matches `usersListSchema`
- [Contract] Content-Type: application/json header

### GET /users/:id — Retrieve User by ID
- [Positive] Returns 200 with matching user data, valid schema
- [Negative] Valid UUID but absent → 404 + `errorResponseSchema`
- [Negative] Malformed ID (`invalid@id#123`) → 400
- [Negative] Non-UUID string → 400
- [Data-driven] First 3 `testUsers` each retrievable by ID → 200
- [Contract] Existing → 200 OK
- [Contract] Non-existent → 404 Not Found
- [Contract] Response matches `userSchema`

### PUT /users/:id — Update User
- [Positive] Full update → 200, updated fields reflected, valid schema
- [Positive] Partial update → unchanged fields preserved
- [Negative] Invalid email in payload → 400
- [Negative] Empty payload `{}` → 400
- [Negative] Valid UUID but absent → 404
- [Negative] Malformed ID → 400
- [Negative] Email already used by another user → 409, `error.code === "EMAIL_ALREADY_EXISTS"`
- [Data-driven] 2 users updated with unique emails → 200 each
- [Contract] Existing → 200 OK
- [Contract] Non-existent → 404 Not Found
- [Contract] Response matches `userSchema`

### DELETE /users/:id
- [Positive] 204 on deletion, subsequent GET returns 404
- [Negative] Valid UUID but absent → 404 + `errorResponseSchema`
- [Negative] Malformed ID → 400
- [Idempotency] First delete → 204, second delete → 404
- [Data-driven] 3 users deleted and verified 404 after each
- [Contract] Existing → 204 No Content
- [Contract] Non-existent → 404 Not Found

### Request Payload Contracts
- `validUser` satisfies `createUserPayloadSchema`, POST returns 201
- Minimal payload satisfies `createUserPayloadSchema`, POST returns 201
- Partial payload (firstName only) fails `createUserPayloadSchema`
- Invalid email payload fails `createUserPayloadSchema`
- Full update payload satisfies `updateUserPayloadSchema`

### Response Body Contracts
- POST response matches `userSchema`
- Error response matches `errorResponseSchema`
- No sensitive fields exposed (no `password`, `passwordHash`, `secret`)
- `createdAt` and `updatedAt` are valid ISO 8601 strings
- `id` is a non-empty string

### Response Header Contracts
- POST, GET, PUT responses all include `Content-Type: application/json`

### Idempotency & Data Integrity
- Repeated GET /users/:id returns identical data
- Two POSTs with unique emails create separate records (distinct IDs and emails)
- All `testUsers` create unique IDs

### HTTP Status Code Coverage
- POST → 201 Created
- POST invalid → 400 Bad Request
- Full CRUD cycle: GET 200, GET/:id 200, PUT 200, DELETE 204, GET/:id after delete 404
- All response bodies match their respective schemas

---

## UI Test Coverage

### E2E Complete Purchase (`complete-purchase.e2e.spec.ts`)
- [Positive] Add multiple products with custom quantities → verify cart badge → verify cart items count + price summary → fill checkout form → submit → verify order confirmation
- [Negative] Empty cart → checkout page blocked
- [Negative] Invalid checkout form data → validation errors displayed

### Product Listing (`pageWiseTests/product-listing.spec.ts`)
- Products load and are visible on navigate
- Add product to cart increments cart badge
- Navigate to product details from listing
- Search by keyword filters results
- Filter by category shows correct products

### Product Details (`pageWiseTests/product-details.spec.ts`)
- Product name, price, description, category, stock status displayed
- Quantity selector defaults to 1
- Increase quantity → add to cart → cart badge reflects quantity
- Decrease quantity does not go below 1
- Add to cart from details → item appears in cart
- Back navigation returns to listing
- Cart data persists after navigating away

### Cart (`pageWiseTests/cart.spec.ts`)
- Empty cart shows empty-state component
- Added product appears as a line item
- Quantity update reflected in price summary
- Remove single item removes line item
- Remove all items → empty state
- Price summary shows subtotal, tax, shipping, total correctly

### Checkout (`pageWiseTests/checkout.spec.ts`)
- Cannot proceed to checkout with empty cart
- Checkout form fills and submits successfully
- Order confirmation page shows order ID
- Missing required fields (firstName, lastName, email) show field-level errors
- Invalid email format shows error
- Invalid phone format shows error
- Invalid zip code shows error
- Back-to-cart navigates back and preserves cart items

---

## WebSocket Coverage (`users.websocket.spec.ts`)
- WebSocket connection established on page load
- Connection remains open during API operations
- `userCreated` event received after POST /users, payload valid
- `userUpdated` event received after PUT /users/:id, payload valid
- `userDeleted` event received after DELETE /users/:id
- Event payload validated against `userSchema`
- Clean WebSocket disconnect

---

## Schema Validation (AJV)

| Schema | Used For |
|--------|---------|
| `userSchema` | Single user response body |
| `usersListSchema` | GET /users response array |
| `createUserPayloadSchema` | POST /users request contract |
| `updateUserPayloadSchema` | PUT /users/:id request contract |
| `errorResponseSchema` | Error response format |

---

## Coverage Gaps & Next Steps
- Performance: no load-time or API latency assertions
- Visual regression: no screenshot-diff tests
- Full axe-core accessibility scan not yet wired up
- Firefox and Safari projects exist in config but are commented out
- Security tests (XSS, injection) not yet covered
