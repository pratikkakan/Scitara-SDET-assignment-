export const Endpoints = {
  users:    '/api/users',
  userById: (id: string) => `/api/users/${id}`,
} as const;
