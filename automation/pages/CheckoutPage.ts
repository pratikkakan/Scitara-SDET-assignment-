/**
 * Checkout Page - Page Object Model
 */

import { BasePage } from "./BasePage";

export type CheckoutFormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
};

export class CheckoutPage extends BasePage {
  // Selectors - Form fields
  readonly checkoutContainer = '[data-testid="checkout-container"]';
  readonly firstNameInput = '[data-testid="first-name-input"]';
  readonly lastNameInput = '[data-testid="last-name-input"]';
  readonly emailInput = '[data-testid="email-input"]';
  readonly phoneInput = '[data-testid="phone-input"]';
  readonly addressInput = '[data-testid="address-input"]';
  readonly cityInput = '[data-testid="city-input"]';
  readonly zipCodeInput = '[data-testid="zip-code-input"]';
  readonly cardNumberInput = '[data-testid="card-number-input"]';
  readonly expiryDateInput = '[data-testid="expiry-date-input"]';
  readonly cvvInput = '[data-testid="cvv-input"]';
  readonly submitBtn = '[data-testid="submit-order-btn"]';
  readonly backBtn = '[data-testid="back-to-cart-btn"]';

  // Error messages
  readonly errorContainer = '[data-testid="error-container"]';
  readonly firstNameError = '[data-testid="first-name-error"]';
  readonly lastNameError = '[data-testid="last-name-error"]';
  readonly emailError = '[data-testid="email-error"]';
  readonly phoneError = '[data-testid="phone-error"]';
  readonly addressError = '[data-testid="address-error"]';
  readonly cityError = '[data-testid="city-error"]';
  readonly zipCodeError = '[data-testid="zip-code-error"]';
  readonly cardNumberError = '[data-testid="card-number-error"]';
  readonly expiryDateError = '[data-testid="expiry-date-error"]';
  readonly cvvError = '[data-testid="cvv-error"]';

  // Success confirmation
  readonly orderConfirmation = '[data-testid="order-confirmation"]';
  readonly orderSuccessTitle = '[data-testid="order-success-title"]';
  readonly confirmationMessage = '[data-testid="confirmation-message"]';
  readonly orderId = '[data-testid="order-id"]';
  readonly backHomeButton = '[data-testid="back-home-button"]';

  // Navigation
  async navigate() {
    await this.goto("/checkout");
  }

  // Form filling
  async fillCheckoutForm(data: CheckoutFormData) {
    if (data.firstName) {
      await this.fillByTestId("first-name-input", data.firstName);
    }
    if (data.lastName) {
      await this.fillByTestId("last-name-input", data.lastName);
    }
    if (data.email) {
      await this.fillByTestId("email-input", data.email);
    }
    if (data.phone) {
      await this.fillByTestId("phone-input", data.phone);
    }
    if (data.address) {
      await this.fillByTestId("address-input", data.address);
    }
    if (data.city) {
      await this.fillByTestId("city-input", data.city);
    }
    if (data.zipCode) {
      await this.fillByTestId("zip-code-input", data.zipCode);
    }
    if (data.cardNumber) {
      await this.fillByTestId("card-number-input", data.cardNumber);
    }
    if (data.expiryDate) {
      await this.fillByTestId("expiry-date-input", data.expiryDate);
    }
    if (data.cvv) {
      await this.fillByTestId("cvv-input", data.cvv);
    }
  }

  // Individual field operations
  async setFirstName(firstName: string) {
    await this.fillByTestId("first-name-input", firstName);
  }

  async setLastName(lastName: string) {
    await this.fillByTestId("last-name-input", lastName);
  }

  async setEmail(email: string) {
    await this.fillByTestId("email-input", email);
  }

  async setPhone(phone: string) {
    await this.fillByTestId("phone-input", phone);
  }

  async setAddress(address: string) {
    await this.fillByTestId("address-input", address);
  }

  async setCity(city: string) {
    await this.fillByTestId("city-input", city);
  }

  async setZipCode(zipCode: string) {
    await this.fillByTestId("zip-code-input", zipCode);
  }

  async setCardNumber(cardNumber: string) {
    await this.fillByTestId("card-number-input", cardNumber);
  }

  async setExpiryDate(expiryDate: string) {
    await this.fillByTestId("expiry-date-input", expiryDate);
  }

  async setCVV(cvv: string) {
    await this.fillByTestId("cvv-input", cvv);
  }

  // Get field values
  async getFirstName(): Promise<string | null> {
    return await this.page.locator(this.firstNameInput).inputValue();
  }

  async getEmail(): Promise<string | null> {
    return await this.page.locator(this.emailInput).inputValue();
  }

  async getPhone(): Promise<string | null> {
    return await this.page.locator(this.phoneInput).inputValue();
  }

  // Form submission
  async submitOrder() {
    await this.clickByTestId("submit-order-btn");
  }

  async goBackToCart() {
    await this.clickByTestId("back-to-cart-btn");
  }

  // Error handling
  async getErrorMessage(): Promise<string | null> {
    return await this.getTextByTestId("error-container");
  }

  async getFirstNameError(): Promise<string | null> {
    return await this.getTextByTestId("first-name-error");
  }

  async getLastNameError(): Promise<string | null> {
    return await this.getTextByTestId("last-name-error");
  }

  async getEmailError(): Promise<string | null> {
    return await this.getTextByTestId("email-error");
  }

  async getPhoneError(): Promise<string | null> {
    return await this.getTextByTestId("phone-error");
  }

  async getAddressError(): Promise<string | null> {
    return await this.getTextByTestId("address-error");
  }

  async getCityError(): Promise<string | null> {
    return await this.getTextByTestId("city-error");
  }

  async getZipCodeError(): Promise<string | null> {
    return await this.getTextByTestId("zip-code-error");
  }

  async getCardNumberError(): Promise<string | null> {
    return await this.getTextByTestId("card-number-error");
  }

  async getExpiryDateError(): Promise<string | null> {
    return await this.getTextByTestId("expiry-date-error");
  }

  async getCVVError(): Promise<string | null> {
    return await this.getTextByTestId("cvv-error");
  }

  // Check if error exists
  async hasFieldError(fieldTestId: string): Promise<boolean> {
    return await this.isVisibleByTestId(`${fieldTestId}-error`);
  }

  // Individual error visibility checks
  async isFirstNameErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("first-name-error");
  }

  async isLastNameErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("last-name-error");
  }

  async isEmailErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("email-error");
  }

  async isPhoneErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("phone-error");
  }

  async isAddressErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("address-error");
  }

  async isCityErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("city-error");
  }

  async isZipCodeErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("zip-code-error");
  }

  async isCardNumberErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("card-number-error");
  }

  async isExpiryDateErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("expiry-date-error");
  }

  async isCVVErrorVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("cvv-error");
  }

  // Visibility checks
  async isCheckoutFormVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("checkout-container");
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("order-confirmation");
  }

  // Success confirmation
  async getOrderId(): Promise<string | null> {
    return await this.getTextByTestId("order-id");
  }

  async getOrderSuccessTitle(): Promise<string | null> {
    return await this.getTextByTestId("order-success-title");
  }

  async backToHome() {
    await this.clickByTestId("back-home-button");
  }

  // Wait for page to load
  async waitForCheckoutPageToLoad() {
    await this.waitForElement(this.checkoutContainer, 10000);
  }

  async waitForOrderConfirmation() {
    await this.waitForElement(this.orderConfirmation, 15000);
  }

  // Complete checkout flow
  async completeCheckout(formData: CheckoutFormData) {
    await this.fillCheckoutForm(formData);
    await this.submitOrder();
    await this.waitForOrderConfirmation();
    return await this.getOrderId();
  }
}
