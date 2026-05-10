# Frontend - E-Commerce React Application

## Overview
The frontend is a modern React application built with Vite and TypeScript for an e-commerce platform. It features product listing, shopping cart management, product details, and checkout functionality with real-time state management using React Context.

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
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # React DOM render entry point
│   ├── App.css                    # Main application styles
│   ├── index.css                  # Global styles
│   ├── pages/                     # Page components
│   │   ├── ProductListing.tsx     # Product catalog view
│   │   ├── ProductDetails.tsx     # Individual product details
│   │   ├── Cart.tsx               # Shopping cart
│   │   ├── Checkout.tsx           # Checkout process
│   │   └── index.ts               # Page exports
│   ├── components/                # Reusable components
│   │   ├── Header.tsx             # Navigation header
│   │   ├── ProductCard.tsx        # Product display card
│   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   ├── EmptyState.tsx         # Empty state display
│   │   └── index.ts               # Component exports
│   ├── context/                   # React Context providers
│   │   └── CartContext.tsx        # Cart state management
│   ├── services/                  # API communication
│   │   ├── apiClient.ts           # Axios configuration
│   │   └── productService.ts      # Product API calls
│   ├── types/                     # TypeScript interfaces
│   │   └── index.ts               # Type definitions
│   ├── styles/                    # Component-specific styles
│   │   ├── product-card.css
│   │   ├── product-listing.css
│   │   ├── product-details.css
│   │   ├── cart.css
│   │   ├── checkout.css
│   │   ├── empty-state.css
│   │   └── loading.css
│   ├── data/                      # Static data / mocks
│   ├── hooks/                     # Custom React hooks
│   └── utils/                     # Utility functions
├── public/                        # Static assets
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # TypeScript config for build tools
├── package.json                   # Dependencies and scripts
├── Dockerfile                     # Docker configuration
├── .env.example                   # Environment variables template
└── .eslintrc.config               # ESLint configuration
```

## Pages & Features

### Product Listing (`ProductListing.tsx`)
- Displays all available products
- Product cards with image, name, price, and description
- Add to cart functionality
- Navigate to product details
- Loading state handling
- Empty state when no products

### Product Details (`ProductDetails.tsx`)
- Individual product view with full information
- Product specifications and description
- Image gallery
- Add to cart with quantity selection
- Related products section
- Back to catalog navigation

### Shopping Cart (`Cart.tsx`)
- View all items in cart
- Update product quantities
- Remove items from cart
- Calculate total price with taxes
- Apply coupon/discount codes
- Proceed to checkout
- Empty cart message

### Checkout (`Checkout.tsx`)
- Shipping information form
- Billing address
- Payment method selection
- Order summary
- Place order functionality
- Order confirmation

## Components

### Header
Navigation component featuring:
- Logo and site title
- Navigation links to pages
- Cart item count badge
- User menu (if authenticated)

### ProductCard
Displays product information:
- Product image
- Product name and rating
- Price
- Quick add to cart button
- Click to view details

### LoadingSpinner
Loading indicator shown during:
- Data fetching
- Page transitions
- Async operations

### EmptyState
Displayed when:
- No products found
- Cart is empty
- Search returns no results

## State Management

### CartContext
Centralized cart state management providing:
- Add item to cart
- Remove item from cart
- Update item quantity
- Clear entire cart
- Get cart total
- Get item count

## Services

### apiClient.ts
Axios instance configuration with:
- Base URL pointing to backend API
- Default headers
- Interceptors for request/response handling
- Error handling

### productService.ts
Product API integration:
- Fetch all products
- Fetch product by ID
- Fetch product categories
- Search products
- Get product recommendations

## Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev          # Start Vite dev server with HMR
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

### Production
```bash
npm run build        # Compile and optimize for production
npm run preview      # Preview production build locally
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- Other service endpoints as needed

## Development Scripts
- `npm run dev` - Start dev server (http://localhost:5173 by default)
- `npm run build` - Build for production with minification
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix linting errors
- `npm run type-check` - TypeScript validation

## Styling Architecture
- **Global Styles:** `index.css` and `App.css` for layout
- **Component Styles:** Scoped CSS files in `styles/` folder
- **Responsive Design:** Mobile-first approach with media queries
- **CSS Variables:** Theme colors and spacing

## Key Features
- **Responsive Design** - Mobile, tablet, and desktop support
- **Client-side Routing** - React Router for navigation
- **State Management** - Context API for cart state
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during data fetching
- **Form Validation** - Input validation on checkout
- **SEO Optimization** - Semantic HTML and meta tags
- **TypeScript** - Full type safety

## Docker
A Dockerfile is included for containerization:
```bash
docker build -t frontend .
docker run -p 3000:80 frontend
```

## Dependencies
- **react** ^18.2.0 - UI library
- **react-dom** ^18.2.0 - React rendering
- **react-router-dom** ^6.20.0 - Client-side routing
- **axios** ^1.6.2 - HTTP client

## Type Definitions
TypeScript interfaces for:
- Product data structure
- Cart item structure
- Order information
- User data
- API response formats

## Performance Optimizations
- Code splitting via Vite
- Lazy loading of routes
- Image optimization
- Minification and bundling
- CSS modules for scope isolation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
