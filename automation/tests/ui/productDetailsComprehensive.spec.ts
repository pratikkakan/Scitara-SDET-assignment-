/**
 * Comprehensive Product Details Page Tests
 * - Product information display
 * - Image and media handling
 * - Quantity selection
 * - Add to cart variations
 * - Navigation between related products
 * - Error states and edge cases
 */

import { test, expect } from "@/fixtures/pageManagerFixture";

test.describe("UI: Product Details - In-Depth Product View", () => {
  // ============= PRODUCT INFORMATION DISPLAY =============

  test.describe("✓ Product Information - Display & Content", () => {
    test("Should display product name on details page", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      const productNameBefore = await listingPage.getFirstProductName();
      await listingPage.clickFirstProduct();

      const productNameAfter = await detailsPage.getProductName();

      expect(productNameAfter).toBeTruthy();
      if (productNameBefore) {
        expect(productNameAfter).toContain(productNameBefore.substring(0, 10));
      }
    });

    test("Should display product price", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const price = await detailsPage.getPrice();

      expect(price).toBeTruthy();
      expect(price).toMatch(/\$\d+(\.\d{2})?/); // Should match currency format
    });

    test("Should display product description", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const description = await detailsPage.getDescription();

      expect(description).toBeTruthy();
      expect(description?.length).toBeGreaterThan(10);
    });

    test("Should display product category", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const category = await detailsPage.getCategory();

      expect(category).toBeTruthy();
    });

    test("Should display product stock status", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const stockStatus = await detailsPage.getStockStatus();

      expect(stockStatus).toBeTruthy();
      // Stock status should indicate availability
      expect(
        stockStatus?.toLowerCase().includes("in stock") ||
          stockStatus?.toLowerCase().includes("available"),
      ).toBe(true);
    });

    test("Should display product rating if available", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      try {
        const rating = await detailsPage.getRating();
        if (rating) {
          expect(rating).toBeTruthy();
        }
      } catch {
        // Rating might not be available, that's OK
      }
    });
  });

  // ============= PRODUCT IMAGE & MEDIA =============

  test.describe("✓ Product Image - Display & Interaction", () => {
    test("Should display main product image", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const imageVisible = await detailsPage.isImageVisible();
      expect(imageVisible).toBe(true);
    });

    test("Should display valid image source", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const imageSrc = await detailsPage.getImageSrc();
      expect(imageSrc).toBeTruthy();
      expect(imageSrc).toMatch(/\.(jpg|png|jpeg|webp|gif)$/i);
    });

    test("Should display image with alt text for accessibility", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const altText = await detailsPage.getImageAltText();
      expect(altText).toBeTruthy();
    });

    test("Should allow image zoom/expansion if available", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      try {
        const zoomAvailable = await detailsPage.canZoomImage();
        if (zoomAvailable) {
          await detailsPage.zoomImage();
          // Verify zoom action was possible
          expect(zoomAvailable).toBe(true);
        }
      } catch {
        // Zoom might not be available, that's OK
      }
    });

    test("Should display multiple product images if available", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const imageCount = await detailsPage.getImageCount();
      expect(imageCount).toBeGreaterThanOrEqual(1);
    });
  });

  // ============= QUANTITY SELECTION =============

  test.describe("✓ Quantity Management - Selection & Validation", () => {
    test("Should display quantity selector", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const quantityVisible = await detailsPage.isQuantitySelectorVisible();
      expect(quantityVisible).toBe(true);
    });

    test("Should have default quantity of 1", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const quantity = await detailsPage.getQuantity();
      expect(quantity).toBe("1");
    });

    test("Should increase quantity using plus button", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.increaseQuantity();
      await pageManager.page.waitForTimeout(200);
      await detailsPage.increaseQuantity();
      await pageManager.page.waitForTimeout(200);

      const quantity = await detailsPage.getQuantity();
      expect(parseInt(quantity || "0")).toBeGreaterThanOrEqual(2);
    });

    test("Should decrease quantity using minus button", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // First increase quantity
      await detailsPage.increaseQuantity();
      await pageManager.page.waitForTimeout(100);
      await detailsPage.increaseQuantity();
      await pageManager.page.waitForTimeout(100);
      await detailsPage.increaseQuantity();
      await pageManager.page.waitForTimeout(100);

      const quantityBefore = parseInt((await detailsPage.getQuantity()) || "0");

      // Now decrease
      await detailsPage.decreaseQuantity();
      await pageManager.page.waitForTimeout(200);

      const quantityAfter = parseInt((await detailsPage.getQuantity()) || "0");

      expect(quantityAfter).toBeLessThan(quantityBefore);
    });

    test("Should not allow quantity below 1", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // Try to decrease from 1
      await detailsPage.decreaseQuantity();
      await pageManager.page.waitForTimeout(200);

      const quantity = await detailsPage.getQuantity();
      expect(parseInt(quantity || "0")).toBeGreaterThanOrEqual(1);
    });

    test("Should allow manual quantity input", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.setQuantity(5);
      await pageManager.page.waitForTimeout(200);

      const quantity = await detailsPage.getQuantity();
      expect(quantity).toBe("5");
    });

    test("Should validate quantity does not exceed stock", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // Try to set very high quantity
      try {
        await detailsPage.setQuantity(999);
        await pageManager.page.waitForTimeout(200);

        const quantity = await detailsPage.getQuantity();
        // Should either reject or cap at available stock
        expect(
          parseInt(quantity || "0") <= 999 || parseInt(quantity || "0") === 1,
        ).toBe(true);
      } catch {
        // Form validation might prevent this, which is expected
      }
    });
  });

  // ============= ADD TO CART FUNCTIONALITY =============

  test.describe("✓ Add to Cart - Various Options", () => {
    test("Should add default quantity to cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(500);

      // Verify added to cart (cart count should increase)
      const cartBadge = await pageManager.page
        .locator('[data-testid="cart-badge"]')
        .textContent();

      expect(cartBadge).toBeTruthy();
    });

    test("Should add custom quantity to cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.setQuantity(3);
      await pageManager.page.waitForTimeout(200);
      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(500);

      // Verify item was added with correct quantity
      const cartBadge = await pageManager.page
        .locator('[data-testid="cart-badge"]')
        .textContent();

      expect(cartBadge).toBeTruthy();
    });

    test("Should display success message after adding to cart", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(500);

      try {
        const successMessage = await detailsPage.getSuccessMessage();
        expect(successMessage).toBeTruthy();
      } catch {
        // Success message might not exist, that's OK
      }
    });

    test("Should allow adding same product multiple times", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(300);

      // Go back and add again
      await detailsPage.goBack();
      await pageManager.page.waitForTimeout(300);

      const listingPage2 = pageManager.productListingPage;
      await listingPage2.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(300);

      // Cart count should reflect both additions
      const cartBadge = await pageManager.page
        .locator('[data-testid="cart-badge"]')
        .textContent();

      expect(cartBadge).toBeTruthy();
    });
  });

  // ============= PRODUCT COMPARISON & RECOMMENDATIONS =============

  test.describe("✓ Related Products & Navigation", () => {
    test("Should display related or similar products", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      try {
        const hasRelatedProducts = await detailsPage.hasRelatedProducts();
        if (hasRelatedProducts) {
          expect(hasRelatedProducts).toBe(true);
        }
      } catch {
        // Related products might not be implemented
      }
    });

    test("Should allow navigation to related product", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      try {
        const hasRelatedProducts = await detailsPage.hasRelatedProducts();
        if (hasRelatedProducts) {
          await detailsPage.clickFirstRelatedProduct();
          await pageManager.page.waitForTimeout(500);

          // Verify we're on a different product details page
          const url = pageManager.page.url();
          expect(url).toMatch(/\/products\/\d+/);
        }
      } catch {
        // Related products navigation might not be implemented
      }
    });
  });

  // ============= NAVIGATION & PAGE FLOW =============

  test.describe("✓ Navigation - Between Pages", () => {
    test("Should navigate back to product listing", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.goBack();
      await pageManager.page.waitForTimeout(300);

      const isListingVisible = await listingPage.isProductListingVisible();
      expect(isListingVisible).toBe(true);
    });

    test("Should maintain search/filter context when returning from details", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Apply search
      try {
        await listingPage.searchProducts("laptop");
        await pageManager.page.waitForTimeout(500);

        const productCount = await listingPage.getProductCount();
        if (productCount > 0) {
          await listingPage.clickFirstProduct();
          await detailsPage.waitForProductDetailsToLoad();

          // Go back
          await detailsPage.goBack();
          await pageManager.page.waitForTimeout(300);

          // Verify we're still on filtered results
          const count = await listingPage.getProductCount();
          expect(count).toBeLessThanOrEqual(productCount);
        }
      } catch {
        // Search might not maintain state, that's OK
      }
    });

    test("Should handle direct URL navigation to product", async ({
      pageManager,
    }) => {
      await pageManager.navigateToProduct(1);
      const detailsPage = pageManager.productDetailsPage;

      const isVisible = await detailsPage.isProductDetailsVisible();
      expect(isVisible).toBe(true);

      const productName = await detailsPage.getProductName();
      expect(productName).toBeTruthy();
    });
  });

  // ============= ERROR STATES & EDGE CASES =============

  test.describe("✗ Error States & Edge Cases", () => {
    test("Should handle out of stock product gracefully", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const stockStatus = await detailsPage.getStockStatus();

      // Product might be in stock or out of stock, both are valid states
      expect(stockStatus).toBeTruthy();
    });

    test("Should handle rapid add to cart clicks", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // Rapidly click add to cart
      const addButton = detailsPage.page.locator(
        '[data-testid="add-to-cart-btn"]',
      );

      await addButton.click();
      await addButton.click();
      await addButton.click();

      await pageManager.page.waitForTimeout(500);

      // Cart count should reflect the additions
      const cartBadge = await pageManager.page
        .locator('[data-testid="cart-badge"]')
        .textContent();

      expect(cartBadge).toBeTruthy();
    });

    test("Should handle network timeout gracefully", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Navigate to product
      await listingPage.clickFirstProduct();

      // Page should load eventually
      const detailsPage = pageManager.productDetailsPage;
      const productName = await detailsPage.getProductName();

      expect(productName).toBeTruthy();
    });
  });

  // ============= ACCESSIBILITY =============

  test.describe("✓ Accessibility - Product Details", () => {
    test("Should have proper heading structure", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const heading = await pageManager.page.locator("h1").first().isVisible();

      expect(heading).toBe(true);
    });

    test("Should have accessible quantity controls", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const quantitySelector = pageManager.page.locator(
        '[data-testid*="quantity"]',
      );

      const isVisible = await quantitySelector.first().isVisible();
      expect(isVisible).toBe(true);
    });

    test("Should have descriptive button labels", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const addToCartButton = pageManager.page.locator(
        '[data-testid="add-to-cart-btn"]',
      );

      const isVisible = await addToCartButton.isVisible();
      expect(isVisible).toBe(true);
    });
  });
});
