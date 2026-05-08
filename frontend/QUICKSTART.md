# Quick Start Guide - TechStore Frontend

## Get Up and Running in 2 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will automatically open at **http://localhost:5173**

## What You Get

- ✅ **8 products** - Pre-loaded from mock data
- ✅ **Full cart functionality** - Add, remove, update quantities
- ✅ **Complete checkout flow** - With form validation
- ✅ **Professional UI** - Responsive design for all devices
- ✅ **Test automation ready** - All elements have data-testid attributes

## Try These Features

### 1. Browse Products
- Search for products
- Filter by category
- Click any product to see details

### 2. Add to Cart
- Click "Add to Cart" on any product card
- Or use quantity selector on product details page
- View cart count in header

### 3. Manage Cart
- Update quantities
- Remove items
- See total with tax and shipping

### 4. Checkout
- Fill in billing/shipping address
- Enter payment information
- Review your order
- Place order and get confirmation

## Project Structure

```
frontend/
├── src/
│   ├── pages/          # 4 main pages
│   ├── components/     # Reusable components
│   ├── services/       # API layer
│   ├── context/        # Cart state
│   ├── data/           # Mock products
│   ├── styles/         # CSS files
│   └── types/          # TypeScript types
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Key Files for Automation Testing

All pages and components have `data-testid` attributes:

**Search & Filter:**
- `search-input` - Product search
- `category-filter` - Category buttons

**Product Cards:**
- `product-card-{id}` - Each product
- `quick-add-{id}` - Add to cart button

**Cart:**
- `cart-items` - Cart items list
- `quantity-{id}` - Quantity inputs
- `checkout-button` - Proceed to checkout

**Checkout:**
- `checkout-form` - Main form
- Input fields: `firstName-input`, `email-input`, etc.
- `place-order-button` - Place order button

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## Environment Setup

If you need custom API URL:

1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_URL` if needed
3. Restart dev server

```bash
cp .env.example .env.local
```

## Features Summary

| Page | Features |
|------|----------|
| **Products** | Search, filter by category, quick add, pagination |
| **Product Details** | Full info, rating, stock status, qty selector |
| **Cart** | Add/remove/update items, totals, tax, shipping |
| **Checkout** | Form validation, order review, confirmation |

## Data Persistence

- Shopping cart is saved to browser localStorage
- Cart persists across page refreshes
- Clear cart manually from cart page

## Mock Data

8 products pre-loaded:
- Premium Wireless Headphones
- USB-C Fast Charger
- Mechanical Keyboard
- Portable SSD 1TB
- Wireless Mouse
- 4K Webcam
- LED Monitor 27"
- Laptop Stand

## Responsive Design

Fully responsive for:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## Performance Tips

1. Production build is optimized and minified
2. Code splitting enabled for faster initial load
3. CSS variables for theme customization
4. Images use placeholders (replace with real URLs)

## Troubleshooting

**Port 5173 in use?**
```bash
npm run dev -- --port 3000
```

**Cache issues?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Build fails?**
```bash
npm run type-check  # Check for TS errors
npm run lint        # Check for lint errors
```

## Testing with Automation

Example selectors for Playwright/Cypress:

```javascript
// Search for products
await page.fill('[data-testid="search-input"]', 'Headphones');

// Click category filter
await page.click('[data-testid="category-Electronics"]');

// Add product to cart
await page.click('[data-testid="quick-add-1"]');

// Go to cart
await page.click('[data-testid="nav-cart"]');

// Checkout
await page.click('[data-testid="checkout-button"]');

// Fill form
await page.fill('[data-testid="firstName-input"]', 'John');
await page.fill('[data-testid="email-input"]', 'john@example.com');

// Place order
await page.click('[data-testid="place-order-button"]');

// Verify success
await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
```

## Need Help?

- Check the main `FRONTEND_README.md` for detailed documentation
- Review component files in `src/components/`
- Check page implementations in `src/pages/`
- API methods in `src/services/productService.ts`

## Next Steps

1. ✅ Run `npm run dev`
2. ✅ Click around and explore
3. ✅ Try the checkout flow
4. ✅ Check browser console for any issues
5. ✅ Review the code structure
6. ✅ Set up automation tests using data-testid attributes

Happy coding! 🚀
