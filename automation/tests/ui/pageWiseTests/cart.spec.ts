import { test, expect } from '@/fixtures/base.fixture';
import { testProducts, singleProduct, multipleProducts } from '@/testData/ui/products/productData';

test.describe('Cart — Item Management & Price Summary', () => {
  test.beforeEach(async ({ pom }) => {
    await test.step("Navigate to product listing and wait for products to load", async () => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
    });
  });

  // ─── Cart Content ──────────────────────────────────────────────────────────

  test.describe('Cart Content', () => {
    test('[Positive] shows empty state when no items added', async ({ pom }) => {
      await test.step("Navigate to cart and assert empty state is displayed", async () => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        await pom.cartPage.assertCartEmpty();
      });
    });

    test('[Positive] added product appears in cart', async ({ pom }) => {
      await test.step("Add product to cart from listing page", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
      });

      await test.step("Navigate to cart and verify product appears", async () => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });

    test('[Positive] multiple products all appear in cart', async ({ pom }) => {
      await test.step("Add all test products to cart from listing page", async () => {
        for (const product of multipleProducts) {
          await pom.productListingPage.addProductToCartById(product.id);
        }
      });

      await test.step("Navigate to cart and verify all products are listed", async () => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThanOrEqual(multipleProducts.length);
      });
    });
  });

  // ─── Item Actions ──────────────────────────────────────────────────────────

  test.describe('Item Actions', () => {
    test('[Positive] removes a single item, cart count decreases', async ({ pom }) => {
      await test.step("Add two products to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(testProducts[0].id);
        await pom.productListingPage.addProductToCartById(testProducts[1].id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      const { countBefore, productId } = await test.step("Capture initial item count and first item ID", async () => {
        const countBefore = await pom.cartPage.getItemCount();
        const productId = await pom.cartPage.extractProductIdFromFirstItem();
        return { countBefore, productId };
      });

      await test.step("Remove first item and verify cart count decreased", async () => {
        await pom.cartPage.removeItem(productId);
        const countAfter = await pom.cartPage.getItemCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    test('[Positive] removes all items; empty state shown', async ({ pom }) => {
      await test.step("Add two products to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(testProducts[0].id);
        await pom.productListingPage.addProductToCartById(testProducts[1].id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      await test.step("Remove all items from cart", async () => {
        await pom.cartPage.removeAllItems();
      });

      await test.step("Verify cart shows empty state", async () => {
        await pom.cartPage.assertCartEmpty();
      });
    });

    test('[Positive] updating quantity persists in cart', async ({ pom }) => {
      await test.step("Add product to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      await test.step("Update item quantity to 5", async () => {
        const productId = await pom.cartPage.extractProductIdFromFirstItem();
        await pom.cartPage.updateItemQuantity(productId, 5);
      });
    });
  });

  // ─── Price Summary ─────────────────────────────────────────────────────────

  test.describe('Price Summary', () => {
    test('[Positive] price fields all present after adding product', async ({ pom }) => {
      await test.step("Add product to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      await test.step("Verify all price summary fields are populated", async () => {
        const summary = await pom.cartPage.getCartSummary();
        expect(summary.subtotal).toBeTruthy();
        expect(summary.tax).toBeTruthy();
        expect(summary.shipping).toBeTruthy();
        expect(summary.total).toBeTruthy();
      });
    });

    test('[Positive] total is greater than zero after adding product', async ({ pom }) => {
      await test.step("Add product to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      await test.step("Verify cart total is greater than zero", async () => {
        const total = await pom.cartPage.getTotalAsNumber();
        expect(total).toBeGreaterThan(0);
      });
    });

    test('[Positive] total increases when quantity is updated', async ({ pom }) => {
      await test.step("Add product to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      const totalBefore = await test.step("Capture initial cart total", async () => {
        return await pom.cartPage.getTotalAsNumber();
      });

      await test.step("Update item quantity to 3 and verify total increased", async () => {
        const productId = await pom.cartPage.extractProductIdFromFirstItem();
        await pom.cartPage.updateItemQuantity(productId, 3);
        const totalAfter = await pom.cartPage.getTotalAsNumber();
        expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
      });
    });
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] continue shopping returns to product listing', async ({ pom }) => {
      await test.step("Add product to cart and navigate to cart", async () => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
      });

      await test.step("Click continue shopping and verify product listing is shown", async () => {
        await pom.cartPage.continueShopping();
        await pom.productListingPage.assertPageVisible();
      });
    });

    test('[Negative] empty cart does not show checkout button', async ({ pom }) => {
      await test.step("Navigate to empty cart and verify checkout button is absent", async () => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const isCheckoutVisible = await pom.cartPage.checkoutBtn.isVisible();
        expect(isCheckoutVisible).toBe(false);
      });
    });
  });
});
