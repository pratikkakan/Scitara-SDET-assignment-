import { expect } from '@playwright/test';
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
  get firstNameInput()  { return this.page.getByTestId('firstName-input'); }
  get lastNameInput()   { return this.page.getByTestId('lastName-input'); }
  get emailInput()      { return this.page.getByTestId('email-input'); }
  get phoneInput()      { return this.page.getByTestId('phone-input'); }
  get addressInput()    { return this.page.getByTestId('address-input'); }
  get cityInput()       { return this.page.getByTestId('city-input'); }
  get zipCodeInput()    { return this.page.getByTestId('zipCode-input'); }
  get cardNumberInput() { return this.page.getByTestId('cardNumber-input'); }
  get expiryDateInput() { return this.page.getByTestId('expiryDate-input'); }
  get cvvInput()        { return this.page.getByTestId('cvv-input'); }
  get submitBtn()       { return this.page.getByTestId('place-order-button'); }
  get backBtn()         { return this.page.getByTestId('cancel-button'); }

  // Error locators
  get firstNameError()  { return this.page.getByTestId('firstName-error'); }
  get lastNameError()   { return this.page.getByTestId('lastName-error'); }
  get emailError()      { return this.page.getByTestId('email-error'); }
  get phoneError()      { return this.page.getByTestId('phone-error'); }
  get addressError()    { return this.page.getByTestId('address-error'); }
  get cityError()       { return this.page.getByTestId('city-error'); }
  get zipCodeError()    { return this.page.getByTestId('zipCode-error'); }
  get cardNumberError() { return this.page.getByTestId('cardNumber-error'); }
  get expiryDateError() { return this.page.getByTestId('expiryDate-error'); }
  get cvvError()        { return this.page.getByTestId('cvv-error'); }

  // Confirmation locators
  get orderConfirmation() { return this.page.getByTestId('order-confirmation'); }
  get orderSuccessTitle() { return this.page.getByTestId('order-success-title'); }
  get orderId()           { return this.page.getByTestId('order-id'); }
  get backHomeButton()    { return this.page.getByTestId('back-home-button'); }
  get checkoutContainer() { return this.page.getByTestId('checkout-page'); }

  // Navigation
  async navigate(): Promise<void> {
    await super.navigate('/checkout');
  }

  // Actions
  async fillOrderDetails(data: CheckoutFormData): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName  !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.email     !== undefined) await this.emailInput.fill(data.email);
    if (data.phone     !== undefined) await this.phoneInput.fill(data.phone);
    if (data.address   !== undefined) await this.addressInput.fill(data.address);
    if (data.city      !== undefined) await this.cityInput.fill(data.city);
    if (data.zipCode   !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.cardNumber!== undefined) await this.cardNumberInput.fill(data.cardNumber);
    if (data.expiryDate!== undefined) await this.expiryDateInput.fill(data.expiryDate);
    if (data.cvv       !== undefined) await this.cvvInput.fill(data.cvv);
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
    const errorMap: Record<string, ReturnType<typeof this.page.getByTestId>> = {
      firstName:   this.firstNameError,
      lastName:    this.lastNameError,
      email:       this.emailError,
      phone:       this.phoneError,
      address:     this.addressError,
      city:        this.cityError,
      zipCode:     this.zipCodeError,
      cardNumber:  this.cardNumberError,
      expiryDate:  this.expiryDateError,
      cvv:         this.cvvError,
    };
    const errorLocator = errorMap[field];
    await expect(errorLocator).toBeVisible();
    if (message) await expect(errorLocator).toContainText(message);
  }

  async assertFormVisible(): Promise<void> {
    await expect(this.checkoutContainer).toBeVisible();
  }
}
