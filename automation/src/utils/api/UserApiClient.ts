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
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  createUser(data: Record<string, unknown>) {
    return this.request.post(this.url(Endpoints.users), { data });
  }

  getUsers() {
    return this.request.get(this.url(Endpoints.users));
  }

  getUserById(id: string) {
    return this.request.get(this.url(Endpoints.userById(id)));
  }

  updateUser(id: string, data: Record<string, unknown>) {
    return this.request.put(this.url(Endpoints.userById(id)), { data });
  }

  deleteUser(id: string) {
    return this.request.delete(this.url(Endpoints.userById(id)));
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
