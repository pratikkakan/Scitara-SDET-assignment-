import { APIRequestContext } from '@playwright/test';
import { Endpoints } from './endpoints';

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface CreateOrderPayload {
  userId?: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
}

export class UserApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    apiToken?: string,
  ) {
    this.headers = apiToken ? { Authorization: `Bearer ${apiToken}` } : {};
  }

  // ── User endpoints ────────────────────────────────────────────────────────

  createUser(data: Record<string, unknown>) {
    return this.request.post(this.url(Endpoints.users), { data, headers: this.headers });
  }

  getUsers() {
    return this.request.get(this.url(Endpoints.users), { headers: this.headers });
  }

  getUserById(id: string) {
    return this.request.get(this.url(Endpoints.userById(id)), { headers: this.headers });
  }

  updateUser(id: string, data: Record<string, unknown>) {
    return this.request.put(this.url(Endpoints.userById(id)), { data, headers: this.headers });
  }

  deleteUser(id: string) {
    return this.request.delete(this.url(Endpoints.userById(id)), { headers: this.headers });
  }

  getRoot() {
    return this.request.get(this.baseUrl + '/');
  }

  getHealth() {
    return this.request.get(this.baseUrl + '/health');
  }

  // ── Order endpoints ───────────────────────────────────────────────────────

  createOrder(data: CreateOrderPayload) {
    return this.request.post(this.url(Endpoints.orders), { data, headers: this.headers });
  }

  getOrders() {
    return this.request.get(this.url(Endpoints.orders), { headers: this.headers });
  }

  getOrderById(id: string) {
    return this.request.get(this.url(Endpoints.orderById(id)), { headers: this.headers });
  }

  updateOrderStatus(id: string, status: string) {
    return this.request.patch(this.url(Endpoints.orderStatus(id)), {
      data: { status },
      headers: this.headers,
    });
  }

  // ── Debug endpoints ───────────────────────────────────────────────────────

  triggerServerError() {
    return this.request.get(this.baseUrl + Endpoints.debugTriggerError);
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
