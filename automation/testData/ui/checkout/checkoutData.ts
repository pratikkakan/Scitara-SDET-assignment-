import { CheckoutFormData } from '@/pages/CheckoutPage';

export const validCheckout: CheckoutFormData = {
  firstName:   'Test',
  lastName:    'User',
  email:       'test@example.com',
  phone:       '1234567890',
  address:     '123 Test St',
  city:        'Test City',
  zipCode:     '12345',
  cardNumber:  '4111111111111111',
  expiryDate:  '12/25',
  cvv:         '123',
};

export const invalidCheckout: CheckoutFormData = {
  firstName:   '',
  lastName:    '',
  email:       'invalid',
  phone:       '123',
  address:     '',
  city:        '',
  zipCode:     '123',
  cardNumber:  '1234',
  expiryDate:  '13/99',
  cvv:         '12',
};

export const missingFieldsCheckout: CheckoutFormData = {
  firstName: 'Test',
  lastName:  'User',
};
