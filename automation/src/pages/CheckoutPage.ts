import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';

export interface CheckoutFormData {
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
}

export class CheckoutPage extends BasePage {
  // Form field locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly submitBtn: Locator;
  readonly backBtn: Locator;

  // Error locators
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly phoneError: Locator;
  readonly addressError: Locator;
  readonly cityError: Locator;
  readonly zipCodeError: Locator;
  readonly cardNumberError: Locator;
  readonly expiryDateError: Locator;
  readonly cvvError: Locator;

  // Confirmation locators
  readonly orderConfirmation: Locator;
  readonly orderSuccessTitle: Locator;
  readonly orderId: Locator;
  readonly backHomeButton: Locator;
  readonly checkoutContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName-input');
    this.lastNameInput = page.getByTestId('lastName-input');
    this.emailInput = page.getByTestId('email-input');
    this.phoneInput = page.getByTestId('phone-input');
    this.addressInput = page.getByTestId('address-input');
    this.cityInput = page.getByTestId('city-input');
    this.zipCodeInput = page.getByTestId('zipCode-input');
    this.cardNumberInput = page.getByTestId('cardNumber-input');
    this.expiryDateInput = page.getByTestId('expiryDate-input');
    this.cvvInput = page.getByTestId('cvv-input');
    this.submitBtn = page.getByTestId('place-order-button');
    this.backBtn = page.getByTestId('cancel-button');

    this.firstNameError = page.getByTestId('firstName-error');
    this.lastNameError = page.getByTestId('lastName-error');
    this.emailError = page.getByTestId('email-error');
    this.phoneError = page.getByTestId('phone-error');
    this.addressError = page.getByTestId('address-error');
    this.cityError = page.getByTestId('city-error');
    this.zipCodeError = page.getByTestId('zipCode-error');
    this.cardNumberError = page.getByTestId('cardNumber-error');
    this.expiryDateError = page.getByTestId('expiryDate-error');
    this.cvvError = page.getByTestId('cvv-error');

    this.orderConfirmation = page.getByTestId('order-confirmation');
    this.orderSuccessTitle = page.getByTestId('order-success-title');
    this.orderId = page.getByTestId('order-id');
    this.backHomeButton = page.getByTestId('back-home-button');
    this.checkoutContainer = page.getByTestId('checkout-page');
  }

  // Navigation
  async navigate(): Promise<void> {
    await super.navigate('/checkout');
  }

  // Actions
  async fillOrderDetails(data: CheckoutFormData): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.cardNumber !== undefined) await this.cardNumberInput.fill(data.cardNumber);
    if (data.expiryDate !== undefined) await this.expiryDateInput.fill(data.expiryDate);
    if (data.cvv !== undefined) await this.cvvInput.fill(data.cvv);
  }

  async submitOrder(): Promise<void> {
    await this.submitBtn.click();
  }

  async goBackToCart(): Promise<void> {
    await this.backBtn.click();
  }

  async backToHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async getOrderId(): Promise<string | null> {
    return this.orderId.textContent();
  }

  // Waits
  async waitForPageToLoad(): Promise<void> {
    await this.checkoutContainer.waitFor({ state: 'visible', timeout: 10_000 });
  }

  async waitForOrderConfirmation(): Promise<void> {
    await this.orderConfirmation.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // Assertion helpers
  async assertOrderConfirmed(): Promise<void> {
    await expect(this.orderConfirmation).toBeVisible();
    await expect(this.orderSuccessTitle).toBeVisible();
  }

  async assertFieldError(field: keyof CheckoutFormData, message?: string): Promise<void> {
    const errorMap: Record<string, Locator> = {
      firstName: this.firstNameError,
      lastName: this.lastNameError,
      email: this.emailError,
      phone: this.phoneError,
      address: this.addressError,
      city: this.cityError,
      zipCode: this.zipCodeError,
      cardNumber: this.cardNumberError,
      expiryDate: this.expiryDateError,
      cvv: this.cvvError,
    };
    const errorLocator = errorMap[field];
    await expect(errorLocator).toBeVisible();
    if (message) await expect(errorLocator).toContainText(message);
  }

  async assertFormVisible(): Promise<void> {
    await expect(this.checkoutContainer).toBeVisible();
  }
}
