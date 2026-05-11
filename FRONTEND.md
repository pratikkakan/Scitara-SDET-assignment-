# Frontend — E-Commerce React Application

## Overview
React 18 / Vite / TypeScript single-page application for an e-commerce store. Products are served from a local JSON file. Cart state is managed via React Context API with no external state library.

## Technology Stack
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.7
- **Language:** TypeScript 5.3.3
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.6.2
- **State Management:** React Context API

## Project Structure
```
frontend/
├── src/
│   ├── App.tsx                    # Root component with router setup
│   ├── main.tsx                   # React DOM entry point
│   ├── App.css                    # Root layout styles
│   ├── index.css                  # Global CSS reset / variables
│   ├── pages/
│   │   ├── ProductListing.tsx     # Product catalogue grid
│   │   ├── ProductDetails.tsx     # Single product view with quantity selector
│   │   ├── Cart.tsx               # Cart items, price summary, checkout CTA
│   │   ├── Checkout.tsx           # Checkout form and order confirmation
│   │   └── index.ts               # Re-exports
│   ├── components/
│   │   ├── Header.tsx             # Navigation, cart badge
│   │   ├── ProductCard.tsx        # Product thumbnail card with add-to-cart
│   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   ├── EmptyState.tsx         # Empty list / empty cart placeholder
│   │   └── index.ts               # Re-exports
│   ├── context/
│   │   └── CartContext.tsx        # Cart state (add, remove, update, clear, totals)
│   ├── services/
│   │   ├── apiClient.ts           # Axios instance with base URL and interceptors
│   │   └── productService.ts      # Product API calls (fetch all, fetch by ID)
│   ├── data/
│   │   └── products.json          # Static product catalogue (loaded client-side)
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions
│   └── styles/
│       ├── header.css
│       ├── product-card.css
│       ├── product-listing.css
│       ├── product-details.css
│       ├── cart.css
│       ├── checkout.css
│       ├── empty-state.css
│       └── loading.css
├── public/                        # Static assets
├── index.html                     # HTML entry point
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── Dockerfile
└── .env.example
```

## Pages & Features

### Product Listing (`ProductListing.tsx`)
- Grid of `ProductCard` components loaded from `products.json`
- Search by keyword and filter by category
- Add-to-cart from the listing (increments cart badge)
- Navigate to product details on card click
- Loading and empty states handled

### Product Details (`ProductDetails.tsx`)
- Full product information: name, price, description, category, stock status
- Quantity selector (min 1, respects stock)
- Add-to-cart with selected quantity
- Back-navigation to listing

### Cart (`Cart.tsx`)
- Line items with quantity controls (increase / decrease / remove)
- Price summary: subtotal, tax, shipping, total
- Empty-cart state with return-to-shopping link
- Proceed to Checkout button

### Checkout (`Checkout.tsx`)
- Shipping form: first name, last name, email, phone, address, city, zip code
- Client-side field validation with inline error messages
- Order confirmation screen with generated order ID

## State Management — `CartContext`
Provided at the app root. Exposes:
- `addToCart(product, quantity)` — add or increment a line item
- `removeFromCart(productId)` — remove a line item
- `updateQuantity(productId, quantity)` — set quantity for a line item
- `clearCart()` — empty the cart
- `cartItems`, `cartCount`, `cartTotal`

## Services

### `apiClient.ts`
Axios instance pointing to the backend API (`VITE_API_BASE_URL`). Includes request/response interceptors and error normalisation.

### `productService.ts`
- `getProducts()` — fetch full product list
- `getProductById(id)` — fetch single product

## Getting Started

### Install & Run (Development)
```bash
cd frontend
npm install
npm run dev          # Vite dev server at http://localhost:5173
```

### Production Build
```bash
npm run build        # Output to dist/
npm run preview      # Preview production build locally
```

### Environment Variables
Copy `.env.example` to `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=E-Commerce Store
```

### Docker
```bash
docker build -t frontend .
docker run -p 80:80 frontend
```

## Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (minified, code-split) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run type-check` | TypeScript type validation |
