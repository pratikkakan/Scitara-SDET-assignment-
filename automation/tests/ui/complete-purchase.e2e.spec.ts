import { test, expect } from "@/fixtures/base.fixture";
import { validCheckout } from "@/testData/ui/checkout/checkoutData";
import {
  testProducts,
  multipleProducts,
} from "@/testData/ui/products/productData";

test.describe("Complete Purchase Flow — E2E", () => {
  // ─── End-to-End Positive Flow ──────────────────────────────────────────────

  test("[Positive] complete purchase flow — add multiple products and complete checkout", { tag: ["@E2E Positive"] }, async ({
    pom,
  }) => {
    await test.step("Navigate to product listing and verify products are available", async () => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForLoadingToComplete();
      const productCount = await pom.productListingPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    for (const product of multipleProducts) {
      await test.step(`Add product ID ${product.id} with quantity ${product.quantity} to cart`, async () => {
        await pom.productDetailsPage.navigateToProduct(product.id);
        await pom.productDetailsPage.waitForPageToLoad();
        const title = await pom.productDetailsPage.getTitle();
        expect(title).toBeTruthy();
        if (product.quantity > 1) {
          await pom.productDetailsPage.increaseQuantityBy(product.quantity - 1);
        }  
        await pom.productDetailsPage.assertQuantity(product.quantity);
        await pom.productDetailsPage.addToCart();
      });
    }

    await test.step("Verify cart badge reflects all added products", async () => {
      const cartBadgeCount = await pom.productDetailsPage.cartBadge.getCount();
      expect(cartBadgeCount).toBeGreaterThan(0);
    });

    await test.step("Navigate to cart and verify items and price summary", async () => {
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      const cartItemCount = await pom.cartPage.getItemCount();
      expect(cartItemCount).toBe(multipleProducts.length);
      const cartSummary = await pom.cartPage.getCartSummary();
      expect(cartSummary.subtotal).toBeTruthy();
      expect(cartSummary.total).toBeTruthy();
      const totalAmount = await pom.cartPage.getTotalAsNumber();
      expect(totalAmount).toBeGreaterThan(0);
    });

    await test.step("Proceed to checkout and submit order with valid details", async () => {
      await pom.cartPage.proceedToCheckout();
      await pom.checkoutPage.waitForPageToLoad();
      await pom.checkoutPage.fillOrderDetails(validCheckout);
      await pom.checkoutPage.submitOrder();
    });

    await test.step("Verify order is confirmed and an order ID is issued", async () => {
      await pom.checkoutPage.assertOrderConfirmed();
      const orderId = await pom.checkoutPage.getOrderId();
      expect(orderId).toBeTruthy();
    });
  });

  // ─── Per-Product Detail Page Validation ────────────────────────────────────

  for (const product of testProducts) {
    test(`[Positive] product detail page loads correctly — ${product.name}`, async ({
      pom,
    }) => {
      await test.step(`Navigate to product detail page for ${product.name}`, async () => {
        await pom.productDetailsPage.navigateToProduct(product.id);
        await pom.productDetailsPage.waitForPageToLoad();
      });

      await test.step("Verify core product information is displayed", async () => {
        const title = await pom.productDetailsPage.getTitle();
        expect(title).toBeTruthy();
        const price = await pom.productDetailsPage.getPrice();
        expect(price).toBeTruthy();
        const category = await pom.productDetailsPage.getCategory();
        expect(category).toBeTruthy();
      });

      await test.step("Verify add-to-cart button is enabled and image is visible", async () => {
        await pom.productDetailsPage.assertAddToCartEnabled();
        await pom.productDetailsPage.assertImageVisible();
      });

      await test.step(`Set quantity to ${product.quantity} and verify`, async () => {
        if (product.quantity > 1) {
          await pom.productDetailsPage.increaseQuantityBy(product.quantity - 1);
        }
        await pom.productDetailsPage.assertQuantity(product.quantity);
      });
    });
  }

  // ─── End-to-End Negative Flow ──────────────────────────────────────────────

  test("[Negative] purchase flow fails with validation error on incomplete checkout form", { tag: ["@E2E Negative"] }, async ({
    pom,
  }) => {
    await test.step("Navigate to product and add it to cart", async () => {
      await pom.productDetailsPage.navigateToProduct("1");
      await pom.productDetailsPage.waitForPageToLoad();
      await pom.productDetailsPage.addToCart();
    });

    await test.step("Navigate to cart, verify item is present, and proceed to checkout", async () => {
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      const cartItemCount = await pom.cartPage.getItemCount();
      expect(cartItemCount).toBeGreaterThan(0);
      await pom.cartPage.proceedToCheckout();
      await pom.checkoutPage.waitForPageToLoad();
    });

    await test.step("Submit order form with firstName intentionally blank", async () => {
      await pom.checkoutPage.fillOrderDetails({ ...validCheckout, firstName: "" });
      await pom.checkoutPage.submitOrder();
    });

    await test.step("Verify validation error is shown and user remains on checkout page", async () => {
      await pom.checkoutPage.assertFieldError("firstName");
      await pom.checkoutPage.assertFormVisible();
    });
  });
});
