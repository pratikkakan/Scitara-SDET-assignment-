export const ORDER_STATUS_VALUES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderItemSchema = {
  type: 'object',
  properties: {
    productId: { type: 'string' },
    quantity:  { type: 'number' },
    price:     { type: 'number' },
  },
  required: ['productId', 'quantity', 'price'],
};

export const orderSchema = {
  type: 'object',
  properties: {
    id:        { type: 'string' },
    userId:    { type: 'string' },
    status:    { type: 'string', enum: ORDER_STATUS_VALUES },
    items:     { type: 'array', items: orderItemSchema },
    total:     { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'status', 'items', 'total', 'createdAt', 'updatedAt'],
};

export const ordersListSchema = {
  type: 'array',
  items: orderSchema,
  minItems: 0,
};

export const wsOrderStatusChangedEventSchema = {
  type: 'object',
  properties: {
    eventId:    { type: 'string' },
    type:       { type: 'string', enum: ['ORDER_STATUS_CHANGED'] },
    occurredAt: { type: 'string', format: 'date-time' },
    data: {
      type: 'object',
      properties: {
        order:          orderSchema,
        previousStatus: { type: 'string', enum: ORDER_STATUS_VALUES },
      },
      required: ['order', 'previousStatus'],
    },
  },
  required: ['eventId', 'type', 'occurredAt', 'data'],
};
