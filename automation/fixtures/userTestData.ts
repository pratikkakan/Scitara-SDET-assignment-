/**
 * Test fixtures - Comprehensive user data for API and UI testing
 */

// Valid user data for positive scenarios
export const validUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

export const validUserMinimal = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
};

// Invalid user data for negative scenarios
export const invalidUser = {
  firstName: "",
  lastName: "Doe",
  email: "invalid-email",
};

export const userMissingFirstName = {
  firstName: "",
  lastName: "Test",
  email: "test@example.com",
};

export const userMissingLastName = {
  firstName: "Test",
  lastName: "",
  email: "test@example.com",
};

export const userInvalidEmail = {
  firstName: "Test",
  lastName: "User",
  email: "not-an-email",
};

export const userMissingEmail = {
  firstName: "Test",
  lastName: "User",
};

export const userInvalidPhone = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "invalid-phone",
};

export const userExceedsMaxLength = {
  firstName: "A".repeat(101),
  lastName: "User",
  email: "test@example.com",
};

// Data-driven test data
export const testUsers = [
  {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    phone: "+1111111111",
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+2222222222",
  },
  {
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.brown@example.com",
    phone: "+3333333333",
  },
  {
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.prince@example.com",
    phone: "+4444444444",
  },
  {
    firstName: "Eve",
    lastName: "Adams",
    email: "eve.adams@example.com",
    phone: "+5555555555",
  },
];

// Update test data
export const updateUserData = {
  firstName: "Updated",
  lastName: "Name",
  email: "updated.email@example.com",
  phone: "+9999999999",
};

export const partialUpdateData = {
  firstName: "PartialUpdate",
};

// Checkout test data
export const checkoutFormData = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "1234567890",
  address: "123 Test St",
  city: "Test City",
  zipCode: "12345",
  cardNumber: "4111111111111111",
  expiryDate: "12/25",
  cvv: "123",
};

export const invalidCheckoutData = {
  firstName: "",
  lastName: "",
  email: "invalid",
  phone: "123",
  address: "",
  city: "",
  zipCode: "123",
  cardNumber: "1234",
  expiryDate: "13/99",
  cvv: "12",
};
