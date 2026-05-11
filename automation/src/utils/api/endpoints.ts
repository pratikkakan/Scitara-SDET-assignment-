export const Endpoints = {
  users:            '/api/users',
  userById:         (id: string) => `/api/users/${id}`,
  orders:           '/api/orders',
  orderById:        (id: string) => `/api/orders/${id}`,
  orderStatus:      (id: string) => `/api/orders/${id}/status`,
  debugTriggerError: '/debug/trigger-error',
} as const;
