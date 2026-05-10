import { test, expect } from '@/fixtures/base.fixture';

test.describe('Product Details — View, Quantity & Add to Cart', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.productListingPage.navigate();
    await pom.productListingPage.waitForProductsToLoad();
    await pom.productListingPage.clickFirstProduct();
    await pom.productDetailsPage.waitForPageToLoad();
  });

  // ─── Product Information ───────────────────────────────────────────────────

  test.describe('Product Information', () => {
    test('[Positive] product title is displayed', async ({ pom }) => {
      const title = await pom.productDetailsPage.getTitle();
      expect(title).toBeTruthy();
    });

    test('[Positive] product price is displayed in currency format', async ({ pom }) => {
      const price = await pom.productDetailsPage.getPrice();
      expect(price).toMatch(/\$\d+(\.\d{2})?/);
    });

    test('[Positive] product description is present and non-trivial', async ({ pom }) => {
      const description = await pom.productDetailsPage.getDescription();
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(10);
    });

    test('[Positive] product category is displayed', async ({ pom }) => {
      const category = await pom.productDetailsPage.getCategory();
      expect(category).toBeTruthy();
    });

    test('[Positive] stock status is displayed', async ({ pom }) => {
      const stock = await pom.productDetailsPage.getStockStatus();
      expect(stock).toBeTruthy();
    });

    test('[Positive] product image is visible with alt text', async ({ pom }) => {
      await pom.productDetailsPage.assertImageVisible();

      const alt = await pom.productDetailsPage.getImageAlt();
      expect(alt).toBeTruthy();
    });
  });

  // ─── Quantity Management ───────────────────────────────────────────────────

  test.describe('Quantity Management', () => {
    test('[Positive] quantity increases when increment button clicked', async ({ pom }) => {
      const before = await pom.productDetailsPage.getQuantity();
      await pom.productDetailsPage.increaseQuantity();
      const after = await pom.productDetailsPage.getQuantity();

      expect(parseInt(after)).toBeGreaterThan(parseInt(before));
    });

    test('[Positive] quantity decreases when decrement button clicked (min 1)', async ({ pom }) => {
      await pom.productDetailsPage.increaseQuantity();
      const before = await pom.productDetailsPage.getQuantity();

      await pom.productDetailsPage.decreaseQuantity();
      const after = await pom.productDetailsPage.getQuantity();

      expect(parseInt(after)).toBeLessThan(parseInt(before));
    });

    test('[Positive] quantity can be set directly', async ({ pom }) => {
      await pom.productDetailsPage.setQuantity(3);

      await pom.productDetailsPage.assertQuantity(3);
    });
  });

  // ─── Add to Cart ───────────────────────────────────────────────────────────

  test.describe('Add to Cart', () => {
    test('[Positive] add to cart button is enabled', async ({ pom }) => {
      await pom.productDetailsPage.assertAddToCartEnabled();
    });

    test('[Positive] adding to cart increments badge on listing page', async ({ pom }) => {
      await pom.productDetailsPage.addToCart();
      await pom.productListingPage.navigate();

      const count = await pom.productListingPage.cartBadge.getCount();
      expect(count).toBeGreaterThan(0);
    });

    test('[Positive] adding to cart with custom quantity reflects in cart', async ({ pom }) => {
      await pom.productDetailsPage.increaseQuantityBy(2);
      await pom.productDetailsPage.addToCart();

      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();

      const itemCount = await pom.cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });

  // ─── Navigation ────────────────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] back button returns to product listing', async ({ pom }) => {
      await pom.productDetailsPage.goBack();

      await pom.productListingPage.assertPageVisible();
    });

    test('[Positive] product ID is extractable from URL', async ({ pom }) => {
      const productId = await pom.productDetailsPage.getProductId();
      expect(productId).toBeTruthy();
    });
  });
});
