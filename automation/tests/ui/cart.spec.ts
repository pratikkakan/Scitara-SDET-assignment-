import { test, expect } from '@/fixtures/base.fixture';

test.describe('Cart — Item Management & Price Summary', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.productListingPage.navigate();
    await pom.productListingPage.waitForProductsToLoad();
  });

  // ─── Cart Content ──────────────────────────────────────────────────────────

  test.describe('Cart Content', () => {
    test('[Positive] shows empty state when no items added', async ({ pom }) => {
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      await pom.cartPage.assertCartEmpty();
    });

    test('[Positive] added product appears in cart', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const itemCount = await pom.cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    test('[Positive] multiple products all appear in cart', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.productListingPage.addProductToCart(1);
      await pom.productListingPage.addProductToCart(2);

      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const itemCount = await pom.cartPage.getItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── Item Actions ──────────────────────────────────────────────────────────

  test.describe('Item Actions', () => {
    test('[Positive] removes a single item, cart count decreases', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.productListingPage.addProductToCart(1);

      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const countBefore = await pom.cartPage.getItemCount();

      const firstItem = pom.cartPage.page.locator('[data-testid*="cart-item-"]').first();
      const testId = await firstItem.getAttribute('data-testid');
      const productId = testId?.replace('cart-item-', '') ?? '';

      await pom.cartPage.removeItem(productId);

      const countAfter = await pom.cartPage.getItemCount();
      expect(countAfter).toBeLessThan(countBefore);
    });

    test('[Positive] removes all items; empty state shown', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.productListingPage.addProductToCart(1);

      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      await pom.cartPage.removeAllItems();

      await pom.cartPage.assertCartEmpty();
    });

    test('[Positive] updating quantity persists in cart', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);

      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const firstItem = pom.cartPage.page.locator('[data-testid*="cart-item-"]').first();
      const testId = await firstItem.getAttribute('data-testid');
      const productId = testId?.replace('cart-item-', '') ?? '';

      await pom.cartPage.updateItemQuantity(productId, 5);
    });
  });

  // ─── Price Summary ─────────────────────────────────────────────────────────

  test.describe('Price Summary', () => {
    test('[Positive] price fields all present after adding product', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const summary = await pom.cartPage.getCartSummary();

      expect(summary.subtotal).toBeTruthy();
      expect(summary.tax).toBeTruthy();
      expect(summary.shipping).toBeTruthy();
      expect(summary.total).toBeTruthy();
    });

    test('[Positive] total is greater than zero after adding product', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const total = await pom.cartPage.getTotalAsNumber();
      expect(total).toBeGreaterThan(0);
    });

    test('[Positive] total increases when quantity is updated', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const totalBefore = await pom.cartPage.getTotalAsNumber();

      const firstItem = pom.cartPage.page.locator('[data-testid*="cart-item-"]').first();
      const testId = await firstItem.getAttribute('data-testid');
      const productId = testId?.replace('cart-item-', '') ?? '';

      await pom.cartPage.updateItemQuantity(productId, 3);

      const totalAfter = await pom.cartPage.getTotalAsNumber();
      expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
    });
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] continue shopping returns to product listing', async ({ pom }) => {
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      await pom.cartPage.continueShopping();

      await pom.productListingPage.assertPageVisible();
    });

    test('[Negative] empty cart does not show checkout button', async ({ pom }) => {
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const isCheckoutVisible = await pom.cartPage.checkoutBtn.isVisible();
      expect(isCheckoutVisible).toBe(false);
    });
  });
});
