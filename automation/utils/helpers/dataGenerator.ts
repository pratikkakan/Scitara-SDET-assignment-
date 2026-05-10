export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export function generateUser(overrides?: Partial<UserPayload>): UserPayload {
  const ts = Date.now();
  return {
    firstName: `Test${ts}`,
    lastName: `User${ts}`,
    email: `test.${ts}@example.com`,
    ...overrides,
  };
}

export function generateEmail(): string {
  return `user.${Date.now()}@example.com`;
}
