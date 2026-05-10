import { test, expect } from '@/fixtures/base.fixture';
import { validCheckout } from '@/testData/ui/checkout/checkoutData';

test.describe('Checkout — Order Submission & Form Validation', () => {
  test.beforeEach(async ({ pom }) => {
    await test.step("Add product to cart and navigate to checkout", async () => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      await pom.cartPage.proceedToCheckout();
      await pom.checkoutPage.waitForPageToLoad();
    });
  });

  // ─── Successful Checkout ───────────────────────────────────────────────────

  test.describe('Successful Checkout', () => {
    test('[Positive] completes order with valid data → order confirmed', async ({ pom }) => {
      await test.step("Fill order form with valid details and submit", async () => {
        await pom.checkoutPage.fillOrderDetails(validCheckout);
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify order confirmation is displayed", async () => {
        await pom.checkoutPage.assertOrderConfirmed();
      });
    });

    test('[Positive] order confirmation includes order ID', async ({ pom }) => {
      await test.step("Fill order form and submit", async () => {
        await pom.checkoutPage.fillOrderDetails(validCheckout);
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.waitForOrderConfirmation();
      });

      await test.step("Verify order ID is present on confirmation page", async () => {
        const orderId = await pom.checkoutPage.getOrderId();
        expect(orderId).toBeTruthy();
      });
    });
  });

  // ─── Form Validation — Negative ───────────────────────────────────────────

  test.describe('Form Validation — Required Fields', () => {
    test('[Negative] rejects empty firstName → shows field error', async ({ pom }) => {
      await test.step("Submit order form with blank firstName", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, firstName: '' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify firstName field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('firstName');
      });
    });

    test('[Negative] rejects empty lastName → shows field error', async ({ pom }) => {
      await test.step("Submit order form with blank lastName", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, lastName: '' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify lastName field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('lastName');
      });
    });

    test('[Negative] rejects empty email → shows field error', async ({ pom }) => {
      await test.step("Submit order form with blank email", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: '' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify email field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('email');
      });
    });

    test('[Negative] rejects invalid email format → shows email error', async ({ pom }) => {
      await test.step("Submit order form with invalid email format", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: 'not-an-email' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify email field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('email');
      });
    });

    test('[Negative] rejects invalid phone format → shows phone error', async ({ pom }) => {
      await test.step("Submit order form with invalid phone format", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, phone: 'invalid-phone' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify phone field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('phone');
      });
    });

    test('[Negative] rejects empty address → shows address error', async ({ pom }) => {
      await test.step("Submit order form with blank address", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, address: '' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify address field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('address');
      });
    });

    test('[Negative] rejects invalid zip code → shows zip error', async ({ pom }) => {
      await test.step("Submit order form with invalid zip code", async () => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, zipCode: 'invalid' });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify zipCode field error is displayed", async () => {
        await pom.checkoutPage.assertFieldError('zipCode');
      });
    });
  });

  // ─── Edge Cases ────────────────────────────────────────────────────────────

  test.describe('Edge Cases', () => {
    test('[Positive] form accepts international characters (João, Müller)', async ({ pom }) => {
      await test.step("Fill order form with international characters and submit", async () => {
        await pom.checkoutPage.fillOrderDetails({
          ...validCheckout,
          firstName: 'João',
          lastName: 'Müller',
          address: '123 Café Street',
        });
        await pom.checkoutPage.submitOrder();
      });

      await test.step("Verify order confirmation is displayed", async () => {
        await pom.checkoutPage.assertOrderConfirmed();
      });
    });

    test('[Positive] back-to-cart navigates back with cart intact', async ({ pom }) => {
      await test.step("Navigate back to cart from checkout", async () => {
        await pom.checkoutPage.goBackToCart();
      });

      await test.step("Verify cart is visible and still contains items", async () => {
        await pom.cartPage.assertCartVisible();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });
  });
});
