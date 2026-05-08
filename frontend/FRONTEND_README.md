# TechStore - React + Vite E-Commerce Frontend

A modern, fully-functional e-commerce frontend built with React, TypeScript, and Vite. Features include product listing, product details, shopping cart, and checkout functionality with complete test automation support via data-testid attributes.

## Features

✅ **Product Listing** - Browse all products with search and category filtering
✅ **Product Details** - View detailed product information with quantity selection
✅ **Shopping Cart** - Add, update, and remove items with local storage persistence
✅ **Checkout** - Complete checkout form with validation
✅ **Order Confirmation** - Order summary and confirmation screen
✅ **Responsive Design** - Mobile-first, fully responsive UI
✅ **Mock API** - Simulated API calls with realistic delays
✅ **Loading States** - Professional loading spinners
✅ **Empty States** - Friendly messages for empty content
✅ **Test Automation Ready** - Comprehensive data-testid attributes

## Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling with CSS variables

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── ProductCard.tsx   # Product card component
│   │   ├── LoadingSpinner.tsx# Loading indicator
│   │   ├── EmptyState.tsx    # Empty state component
│   │   └── index.ts          # Component exports
│   ├── pages/                # Page components
│   │   ├── ProductListing.tsx    # Products listing page
│   │   ├── ProductDetails.tsx    # Product details page
│   │   ├── Cart.tsx              # Shopping cart page
│   │   ├── Checkout.tsx          # Checkout page
│   │   └── index.ts              # Page exports
│   ├── context/              # React context
│   │   └── CartContext.tsx   # Shopping cart context
│   ├── services/             # API services
│   │   └── productService.ts # Product API calls
│   ├── data/                 # Mock data
│   │   └── products.json     # Product database
│   ├── types/                # TypeScript types
│   │   └── index.ts          # Type definitions
│   ├── styles/               # Component styles
│   │   ├── header.css
│   │   ├── product-listing.css
│   │   ├── product-card.css
│   │   ├── product-details.css
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── loading.css
│   │   └── empty-state.css
│   ├── App.tsx               # Main app component
│   ├── App.css               # App styles
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Package dependencies already in package.json

### Steps

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - TypeScript type checking

## Features & Components

### Pages

#### 1. **Product Listing** (`/`)

- Display all products in a responsive grid
- Search products by name or description
- Filter by category
- Quick add to cart button
- Loading and empty states

#### 2. **Product Details** (`/product/:id`)

- Full product information
- Product rating and availability
- Quantity selector
- Add to cart with feedback
- Stock status indicator

#### 3. **Shopping Cart** (`/cart`)

- View all cart items
- Update quantities
- Remove items
- Cart summary with totals
- Tax and shipping calculation
- Proceed to checkout button

#### 4. **Checkout** (`/checkout`)

- Billing address form
- Payment information form
- Form validation
- Order review sidebar
- Order placement and confirmation

### Components

#### Header

- Navigation links
- Cart item counter
- Active page indicator
- Responsive design

#### ProductCard

- Product image
- Title and category
- Price and rating
- Stock status
- Quick add button with callback

#### LoadingSpinner

- Animated spinner
- Custom message
- Centered layout

#### EmptyState

- Icon display
- Title and message
- Optional action button
- Customizable content

### Context & State Management

#### CartContext

- Shopping cart state management
- Add/remove/update items
- Cart total calculation
- Local storage persistence
- Custom `useCart` hook

### API Service

#### productService

Methods:

- `getAllProducts()` - Get all products
- `getProductById(id)` - Get single product
- `getProductsByCategory(category)` - Filter by category
- `searchProducts(query)` - Search products
- `getCategories()` - Get all categories
- `processCheckout(items, total, formData)` - Process order

All methods include simulated network delays for realistic behavior.

## Data Models

### Product

```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  quantity?: number;
}
```

### CartItem (extends Product)

```typescript
{
  ...product,
  cartQuantity: number;
}
```

### CheckoutFormData

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
```

## Test Automation

All interactive elements have `data-testid` attributes for easy automation testing:

### Product Listing Page

- `product-listing` - Container
- `search-box` - Search input area
- `search-input` - Search input field
- `category-filter` - Category filter container
- `category-{name}` - Category buttons
- `products-grid` - Products container
- `product-card-{id}` - Individual product cards
- `product-name-{id}`, `product-price-{id}`, etc.
- `quick-add-{id}` - Quick add button

### Product Details

- `product-details` - Container
- `back-button` - Back navigation
- `product-detail-image` - Product image
- `product-detail-name` - Product name
- `product-detail-price` - Price
- `quantity-input` - Quantity selector
- `add-to-cart-button` - Add to cart button

### Cart Page

- `cart-page` - Container
- `cart-items` - Items list
- `cart-item-{id}` - Individual items
- `quantity-{id}` - Quantity input
- `remove-{id}` - Remove button
- `checkout-button` - Checkout button

### Checkout Page

- `checkout-form` - Form element
- `firstName-input`, `email-input`, etc. - Form fields
- `place-order-button` - Submit button
- `order-confirmation` - Confirmation screen
- `order-id` - Order ID display

## Styling

The application uses a modern CSS design system with:

- CSS custom properties (variables) for theming
- Mobile-first responsive design
- Flexbox and CSS Grid layouts
- Smooth transitions and animations
- Professional color palette
- Consistent spacing and typography

### Color Palette

```
Primary: #2563eb (Blue)
Secondary: #1e40af (Dark Blue)
Success: #16a34a (Green)
Error: #dc2626 (Red)
Warning: #ea580c (Orange)
```

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Performance

- Code splitting with Vite
- Lazy loading with React Router
- Local storage caching
- Optimized images with placeholders
- Minified production builds

## Environment Variables

Create `.env.local` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Port 5173 Already in Use

```bash
npm run dev -- --port 3000
```

### Hot Module Replacement Not Working

- Clear browser cache
- Restart development server

### Build Size Issues

```bash
npm run build
# Check dist folder size
```

## Future Enhancements

- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Order history
- [ ] Payment gateway integration
- [ ] Real API integration
- [ ] PWA support
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Performance optimizations (lazy loading images, etc.)

## License

This project is part of Scitara SDET assignment.

## Support

For issues or questions, refer to the main project documentation.
