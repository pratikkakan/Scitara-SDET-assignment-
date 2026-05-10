export const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
};

export const validUserMinimal = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
};

// Negative scenarios — field truly absent (not empty string)
export const userMissingFirstName = {
  lastName: 'Test',
  email: 'test@example.com',
};

export const userMissingLastName = {
  firstName: 'Test',
  email: 'test@example.com',
};

export const userMissingEmail = {
  firstName: 'Test',
  lastName: 'User',
};

export const userInvalidEmail = {
  firstName: 'Test',
  lastName: 'User',
  email: 'not-an-email',
};

export const userInvalidPhone = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: 'invalid-phone',
};

export const userExceedsMaxLength = {
  firstName: 'A'.repeat(101),
  lastName: 'User',
  email: 'test@example.com',
};

// Data-driven scenarios
export const testUsers = [
  { firstName: 'Alice',   lastName: 'Smith',   email: 'alice.smith@example.com',   phone: '+1111111111' },
  { firstName: 'Bob',     lastName: 'Johnson',  email: 'bob.johnson@example.com',   phone: '+2222222222' },
  { firstName: 'Charlie', lastName: 'Brown',    email: 'charlie.brown@example.com', phone: '+3333333333' },
  { firstName: 'Diana',   lastName: 'Prince',   email: 'diana.prince@example.com',  phone: '+4444444444' },
  { firstName: 'Eve',     lastName: 'Adams',    email: 'eve.adams@example.com',     phone: '+5555555555' },
];

export const updateUserData = {
  firstName: 'Updated',
  lastName: 'Name',
  email: 'updated.email@example.com',
  phone: '+9999999999',
};

export const partialUpdateData = {
  firstName: 'PartialUpdate',
};
