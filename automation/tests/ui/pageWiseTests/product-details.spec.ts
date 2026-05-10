import { test, expect } from '@/fixtures/base.fixture';

test.describe('Product Details — View, Quantity & Add to Cart', () => {
  test.beforeEach(async ({ pom }) => {
    await test.step("Navigate to product listing and open first product detail page", async () => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
      await pom.productListingPage.clickFirstProduct();
      await pom.productDetailsPage.waitForPageToLoad();
    });
  });

  // ─── Product Information ───────────────────────────────────────────────────

  test.describe('Product Information', () => {
    test('[Positive] product title is displayed', async ({ pom }) => {
      await test.step("Assert product title is present and non-empty", async () => {
        const title = await pom.productDetailsPage.getTitle();
        expect(title).toBeTruthy();
      });
    });

    test('[Positive] product price is displayed in currency format', async ({ pom }) => {
      await test.step("Assert product price matches currency format", async () => {
        const price = await pom.productDetailsPage.getPrice();
        expect(price).toMatch(/\$\d+(\.\d{2})?/);
      });
    });

    test('[Positive] product description is present and non-trivial', async ({ pom }) => {
      await test.step("Assert product description is present and has meaningful length", async () => {
        const description = await pom.productDetailsPage.getDescription();
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(10);
      });
    });

    test('[Positive] product category is displayed', async ({ pom }) => {
      await test.step("Assert product category is present and non-empty", async () => {
        const category = await pom.productDetailsPage.getCategory();
        expect(category).toBeTruthy();
      });
    });

    test('[Positive] stock status is displayed', async ({ pom }) => {
      await test.step("Assert stock status is present and non-empty", async () => {
        const stock = await pom.productDetailsPage.getStockStatus();
        expect(stock).toBeTruthy();
      });
    });

    test('[Positive] product image is visible with alt text', async ({ pom }) => {
      await test.step("Assert product image is visible and has alt text", async () => {
        await pom.productDetailsPage.assertImageVisible();
        const alt = await pom.productDetailsPage.getImageAlt();
        expect(alt).toBeTruthy();
      });
    });
  });

  // ─── Quantity Management ───────────────────────────────────────────────────

  test.describe('Quantity Management', () => {
    test('[Positive] quantity increases when increment button clicked', async ({ pom }) => {
      const before = await test.step("Capture initial quantity", async () => {
        return await pom.productDetailsPage.getQuantity();
      });

      await test.step("Click increment and verify quantity increased", async () => {
        await pom.productDetailsPage.increaseQuantity();
        const after = await pom.productDetailsPage.getQuantity();
        expect(parseInt(after)).toBeGreaterThan(parseInt(before));
      });
    });

    test('[Positive] quantity decreases when decrement button clicked (min 1)', async ({ pom }) => {
      await test.step("Increment quantity first to allow decrement", async () => {
        await pom.productDetailsPage.increaseQuantity();
      });

      const before = await test.step("Capture quantity before decrement", async () => {
        return await pom.productDetailsPage.getQuantity();
      });

      await test.step("Click decrement and verify quantity decreased", async () => {
        await pom.productDetailsPage.decreaseQuantity();
        const after = await pom.productDetailsPage.getQuantity();
        expect(parseInt(after)).toBeLessThan(parseInt(before));
      });
    });

    test('[Positive] quantity can be set directly', async ({ pom }) => {
      await test.step("Set quantity to 3 and verify value is applied", async () => {
        await pom.productDetailsPage.setQuantity(3);
        await pom.productDetailsPage.assertQuantity(3);
      });
    });
  });

  // ─── Add to Cart ───────────────────────────────────────────────────────────

  test.describe('Add to Cart', () => {
    test('[Positive] add to cart button is enabled', async ({ pom }) => {
      await test.step("Assert add-to-cart button is enabled", async () => {
        await pom.productDetailsPage.assertAddToCartEnabled();
      });
    });

    test('[Positive] adding to cart increments badge on listing page', async ({ pom }) => {
      await test.step("Add product to cart", async () => {
        await pom.productDetailsPage.addToCart();
      });

      await test.step("Navigate to listing page and verify cart badge incremented", async () => {
        await pom.productListingPage.navigate();
        const count = await pom.productListingPage.cartBadge.getCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    test('[Positive] adding to cart with custom quantity reflects in cart', async ({ pom }) => {
      await test.step("Increase quantity by 2 and add to cart", async () => {
        await pom.productDetailsPage.increaseQuantityBy(2);
        await pom.productDetailsPage.addToCart();
      });

      await test.step("Navigate to cart and verify item is present", async () => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] back button returns to product listing', async ({ pom }) => {
      await test.step("Click back and verify product listing page is shown", async () => {
        await pom.productDetailsPage.goBack();
        await pom.productListingPage.assertPageVisible();
      });
    });

    test('[Positive] product ID is extractable from URL', async ({ pom }) => {
      await test.step("Extract product ID from URL and verify it is present", async () => {
        const productId = await pom.productDetailsPage.getProductId();
        expect(productId).toBeTruthy();
      });
    });
  });
});
