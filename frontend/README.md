# Frontend Application - Architecture & Implementation Guide

## Overview

React + Vite E-Commerce application with product listing, details, cart, and checkout pages.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

## Directory Structure

```
src/
├── main.tsx             # React entry point
├── App.tsx              # Root component with routing
├── index.css            # Global styles
├── pages/               # Page-level components
│   ├── ProductListing.tsx
│   ├── ProductDetails.tsx
│   ├── Cart.tsx
│   └── Checkout.tsx
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── CartItem.tsx
│   └── Footer.tsx
├── services/            # API clients
│   ├── apiClient.ts     # Axios instance
│   ├── userService.ts
│   └── productService.ts
├── hooks/               # Custom React hooks
│   ├── useCart.ts
│   ├── useFetch.ts
│   └── useLocalStorage.ts
├── types/               # TypeScript interfaces
│   ├── user.ts
│   └── product.ts
├── utils/               # Helper functions
│   ├── formatPrice.ts
│   ├── storage.ts
│   └── validators.ts
├── styles/              # Organized stylesheets
│   ├── components.css
│   ├── pages.css
│   └── variables.css
└── data/                # Local JSON mock data
    └── products.json
```

## Core Features

### Pages

1. **ProductListing**
   - Display products from JSON/API
   - Filter by category
   - Search functionality
   - Add to cart

2. **ProductDetails**
   - Show full product info
   - Quantity selector
   - Add to cart with quantity
   - Related products

3. **Cart**
   - List cart items
   - Update quantities
   - Remove items
   - Calculate totals

4. **Checkout**
   - User details form
   - Address entry
   - Order summary
   - Place order

### API Integration

Axios client with interceptors:

```typescript
import apiClient from "@/services/apiClient";

// Automatic headers, error handling, auth token injection
const response = await apiClient.get("/users");
```

### State Management

Can use:

- React Context API (lightweight)
- Redux (scalable)
- Zustand (minimal)

**Example with Context:**

```typescript
const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}
```

### Hooks Best Practices

```typescript
// Custom hook for API calls
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    apiClient
      .get<T>(url)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

## Available Scripts

```bash
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix lint issues
npm run type-check       # Check TypeScript types
```

## Vite Configuration

Key features in `vite.config.ts`:

- **API Proxy**: `/api` requests proxied to `http://localhost:3000`
- **Path Aliases**: `@/*` imports
- **Source Maps**: For debugging
- **Optimizations**: Terser minification

```typescript
// Example import with alias
import { apiClient } from "@/services/apiClient";
```

## Component Structure

### Page Component Pattern

```typescript
import { useEffect, useState } from 'react'

export function ProductListing() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="product-listing">
      {/* Render products */}
    </div>
  )
}
```

### Reusable Component Pattern

```typescript
interface ProductCardProps {
  id: string
  name: string
  price: number
  onAddToCart: (quantity: number) => void
}

export function ProductCard({
  id,
  name,
  price,
  onAddToCart
}: ProductCardProps) {
  return (
    <div className="product-card">
      {/* Card content */}
    </div>
  )
}
```

## Styling Strategy

```
styles/
├── variables.css        # CSS custom properties
├── components.css       # Component styles
└── pages.css           # Page-level styles
```

## Type Definitions

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

// src/types/cart.ts
export interface CartItem {
  product: Product;
  quantity: number;
}
```

## Mock Data

Local products JSON for development:

```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "price": 999,
      "category": "Electronics"
    }
  ]
}
```

## Environment Variables

See `.env.example`:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3001
```

Access in components:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## TypeScript Features

- **Strict Mode**: All strict checks enabled
- **Path Aliases**: Clean imports
- **Interface Enforcement**: Props validation
- **No `any` Types**: Type safety enforced

## Performance Tips

1. **Code Splitting**: Vite handles automatically
2. **Lazy Loading**: Route-based code splitting
3. **Image Optimization**: Use web-optimized formats
4. **Memoization**: Use React.memo for expensive renders

```typescript
export const ProductCard = React.memo(({ product }) => {
  return <div>{product.name}</div>
})
```

## Next Steps

1. Implement page components
2. Add form validation
3. Implement error boundaries
4. Add loading states
5. Optimize images
6. Add PWA features
