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

export class UserApiClient {
  private readonly headers: Record<string, string>;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    apiToken?: string,
  ) {
    this.headers = apiToken ? { Authorization: `Bearer ${apiToken}` } : {};
  }

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

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
