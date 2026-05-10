import { test, expect } from '@/fixtures/base.fixture';
import { validCheckout, invalidCheckout } from '@/testData/ui/checkout/checkoutData';

test.describe('Checkout — Order Submission & Form Validation', () => {
  test.beforeEach(async ({ pom }) => {
    // Add a product to cart so checkout is accessible
    await pom.productListingPage.navigate();
    await pom.productListingPage.waitForProductsToLoad();
    await pom.productListingPage.addProductToCart(0);
    await pom.cartPage.navigate();
    await pom.cartPage.waitForCartToLoad();
    await pom.cartPage.proceedToCheckout();
    await pom.checkoutPage.waitForPageToLoad();
  });

  // ─── Successful Checkout ───────────────────────────────────────────────────

  test.describe('Successful Checkout', () => {
    test('[Positive] completes order with valid data → order confirmed', async ({ pom }) => {
      // Arrange: already on checkout page via beforeEach

      // Act
      await pom.checkoutPage.fillOrderDetails(validCheckout);
      await pom.checkoutPage.submitOrder();

      // Assert
      await pom.checkoutPage.assertOrderConfirmed();
    });

    test('[Positive] order confirmation includes order ID', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails(validCheckout);
      await pom.checkoutPage.submitOrder();
      await pom.checkoutPage.waitForOrderConfirmation();

      const orderId = await pom.checkoutPage.getOrderId();
      expect(orderId).toBeTruthy();
    });
  });

  // ─── Form Validation — Negative ───────────────────────────────────────────

  test.describe('Form Validation — Required Fields', () => {
    test('[Negative] rejects empty firstName → shows field error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, firstName: '' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('firstName');
    });

    test('[Negative] rejects empty lastName → shows field error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, lastName: '' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('lastName');
    });

    test('[Negative] rejects empty email → shows field error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: '' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('email');
    });

    test('[Negative] rejects invalid email format → shows email error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: 'not-an-email' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('email');
    });

    test('[Negative] rejects invalid phone format → shows phone error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, phone: 'invalid-phone' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('phone');
    });

    test('[Negative] rejects empty address → shows address error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, address: '' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('address');
    });

    test('[Negative] rejects invalid zip code → shows zip error', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, zipCode: 'invalid' });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertFieldError('zipCode');
    });
  });

  // ─── Edge Cases ────────────────────────────────────────────────────────────

  test.describe('Edge Cases', () => {
    test('[Positive] form accepts international characters (João, Müller)', async ({ pom }) => {
      await pom.checkoutPage.fillOrderDetails({
        ...validCheckout,
        firstName: 'João',
        lastName: 'Müller',
        address: '123 Café Street',
      });
      await pom.checkoutPage.submitOrder();

      await pom.checkoutPage.assertOrderConfirmed();
    });

    test('[Positive] back-to-cart navigates back with cart intact', async ({ pom }) => {
      await pom.checkoutPage.goBackToCart();

      await pom.cartPage.assertCartVisible();

      const itemCount = await pom.cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });
});
