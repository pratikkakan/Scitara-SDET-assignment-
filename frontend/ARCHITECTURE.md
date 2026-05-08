# React + Vite E-Commerce Frontend - Architecture Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      React Application                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    index.html                              │  │
│  │           (Entry point + DOM root element)                 │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     main.tsx                               │  │
│  │               (React entry point)                          │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      App.tsx                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │           CartProvider (Context)                     │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │          Router (React Router)                 │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │         Header Component                 │  │  │  │  │
│  │  │  │  │  (Navigation + Cart Badge)              │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  │                                               │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  Route: / (ProductListing Page)         │  │  │  │  │
│  │  │  │  │  ├─ ProductCard components             │  │  │  │  │
│  │  │  │  │  ├─ Search functionality               │  │  │  │  │
│  │  │  │  │  ├─ Category filtering                 │  │  │  │  │
│  │  │  │  │  ├─ Loading state                      │  │  │  │  │
│  │  │  │  │  └─ Empty state                        │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  │                                               │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  Route: /product/:id (Details Page)     │  │  │  │  │
│  │  │  │  │  ├─ Product image                       │  │  │  │  │
│  │  │  │  │  ├─ Product info                        │  │  │  │  │
│  │  │  │  │  ├─ Quantity selector                   │  │  │  │  │
│  │  │  │  │  └─ Add to cart                         │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  │                                               │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  Route: /cart (Cart Page)               │  │  │  │  │
│  │  │  │  │  ├─ Cart items list                     │  │  │  │  │
│  │  │  │  │  ├─ Quantity controls                   │  │  │  │  │
│  │  │  │  │  ├─ Order summary                       │  │  │  │  │
│  │  │  │  │  └─ Checkout button                     │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  │                                               │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  Route: /checkout (Checkout Page)       │  │  │  │  │
│  │  │  │  │  ├─ Billing form                        │  │  │  │  │
│  │  │  │  │  ├─ Payment form                        │  │  │  │  │
│  │  │  │  │  ├─ Form validation                     │  │  │  │  │
│  │  │  │  │  ├─ Order review                        │  │  │  │  │
│  │  │  │  │  └─ Order confirmation                  │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  │                                               │  │  │  │
│  │  │  │  ┌──────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │           Footer Component               │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │  │
│  └────────────────────────────────────────────────────────┘  │  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           Context & State Management                       │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │           CartContext                               │  │  │
│  │  │  ├─ State: cartItems[]                              │  │  │
│  │  │  ├─ addItem(product, quantity)                      │  │  │
│  │  │  ├─ removeItem(productId)                           │  │  │
│  │  │  ├─ updateQuantity(productId, quantity)             │  │  │
│  │  │  ├─ getTotalPrice()                                 │  │  │
│  │  │  └─ localStorage persistence                        │  │  │
│  │  └────────────────────────┬─────────────────────────────┘  │  │
│  │                           ↓                                  │  │
│  │          ┌──────────────────────────────────┐               │  │
│  │          │   useCart() Custom Hook          │               │  │
│  │          │ (Consumer of CartContext)        │               │  │
│  │          └──────────────────────────────────┘               │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │             Services Layer (API Calls)                     │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │           productService                            │  │  │
│  │  │  ├─ getAllProducts()           → products.json      │  │  │
│  │  │  ├─ getProductById(id)         → products.json      │  │  │
│  │  │  ├─ getProductsByCategory()    → products.json      │  │  │
│  │  │  ├─ searchProducts(query)      → products.json      │  │  │
│  │  │  ├─ getCategories()            → products.json      │  │  │
│  │  │  └─ processCheckout()          → mock response      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                           ↓                                  │  │
│  │          ┌──────────────────────────────────┐               │  │
│  │          │   Mock API Data                  │               │  │
│  │          │  (src/data/products.json)        │               │  │
│  │          │  8 products with details         │               │  │
│  │          └──────────────────────────────────┘               │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │         Components & Styling                              │  │
│  │                                                             │  │
│  │  Components:                                               │  │
│  │  ├─ Header (reusable)                                      │  │
│  │  ├─ ProductCard (reusable)                                │  │
│  │  ├─ LoadingSpinner (reusable)                             │  │
│  │  └─ EmptyState (reusable)                                 │  │
│  │                                                             │  │
│  │  Styles:                                                   │  │
│  │  ├─ App.css (global)                                       │  │
│  │  ├─ header.css                                             │  │
│  │  ├─ product-listing.css                                    │  │
│  │  ├─ product-card.css                                       │  │
│  │  ├─ product-details.css                                    │  │
│  │  ├─ cart.css                                               │  │
│  │  ├─ checkout.css                                           │  │
│  │  ├─ loading.css                                            │  │
│  │  └─ empty-state.css                                        │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
App
├── CartProvider
│   └── Router
│       ├── Header
│       │   ├── Logo
│       │   └── Nav (with CartBadge)
│       │
│       ├── ProductListing (/)
│       │   ├── SearchBox
│       │   ├── CategoryFilter
│       │   ├── LoadingSpinner (conditional)
│       │   ├── EmptyState (conditional)
│       │   └── ProductCard[] (grid)
│       │       ├── ProductImage
│       │       └── ProductInfo
│       │
│       ├── ProductDetails (/product/:id)
│       │   ├── ProductImage
│       │   ├── ProductInfo
│       │   ├── QuantitySelector
│       │   ├── LoadingSpinner (conditional)
│       │   └── EmptyState (conditional)
│       │
│       ├── Cart (/cart)
│       │   ├── CartItem[] (list)
│       │   │   ├── ItemImage
│       │   │   ├── ItemInfo
│       │   │   ├── QuantityControl
│       │   │   └── RemoveButton
│       │   ├── OrderSummary (sidebar)
│       │   └── CheckoutButton
│       │
│       ├── Checkout (/checkout)
│       │   ├── BillingForm
│       │   ├── PaymentForm
│       │   └── OrderReview
│       │
│       └── Footer
```

---

## 🔄 Data Flow Diagrams

### Adding Product to Cart

```
ProductCard
    │
    ├─ User clicks "Add to Cart"
    │
    └─→ onQuickAdd callback
        │
        └─→ useCart() hook
            │
            └─→ addItem(product, quantity)
                │
                └─→ CartContext.addItem()
                    │
                    ├─ Add/Update item in state
                    │
                    └─ localStorage.setItem('cart', ...)
                        │
                        └─→ Header Badge Updates ✓
```

### Checkout Flow

```
Cart Page
    │
    └─ User clicks "Proceed to Checkout"
        │
        ├─ Navigate to /checkout
        │
        ├─ User fills form
        │   ├─ Validates on blur
        │   └─ Shows errors
        │
        └─ User clicks "Place Order"
            │
            ├─ Validate entire form
            │
            ├─ Call productService.processCheckout()
            │
            ├─ Show loading state
            │
            ├─ Receive confirmation
            │
            ├─ Clear cart via CartContext.clearCart()
            │
            └─ Display OrderConfirmation ✓
```

### Page Navigation

```
Header (Navigation)
    ├─ Logo → "/"
    ├─ Products → "/"
    └─ Cart → "/cart"

ProductListing
    └─ Click Product Card → "/product/:id"

ProductDetails
    ├─ Add to Cart → (state updated)
    ├─ Back → "/"
    └─ View Cart → "/cart"

Cart
    ├─ Continue Shopping → "/"
    ├─ Checkout → "/checkout"
    └─ Click Product → "/product/:id"

Checkout
    ├─ Cancel → "/cart"
    └─ Place Order → OrderConfirmation
        └─ Back Home → "/"
```

---

## 🎯 State Management Flow

```
                    Global State (CartContext)
                           │
                    ┌──────┴──────┐
                    │             │
                    ↓             ↓
            localStorage      Memory State
                    │             │
                    └──────┬──────┘
                           ↓
                    useCart() Hook
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
    ProductListing      Cart Page        Checkout
    (addItem)         (updateQuantity)  (getTotalPrice)
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                    Components Update ✓
```

---

## 📦 Module Dependencies

```
App.tsx
├── CartProvider (from CartContext)
├── Router (from react-router-dom)
├── Header (from components)
├── Pages (ProductListing, ProductDetails, Cart, Checkout)
└── App.css

ProductListing.tsx
├── productService
├── useCart (from CartContext)
├── ProductCard (from components)
├── LoadingSpinner (from components)
├── EmptyState (from components)
└── product-listing.css

ProductDetails.tsx
├── productService
├── useCart (from CartContext)
├── LoadingSpinner (from components)
├── EmptyState (from components)
└── product-details.css

Cart.tsx
├── useCart (from CartContext)
├── EmptyState (from components)
└── cart.css

Checkout.tsx
├── useCart (from CartContext)
├── productService
├── LoadingSpinner (from components)
├── EmptyState (from components)
└── checkout.css

CartContext.tsx
├── React hooks (useState, useContext, useEffect, ReactNode)
└── Types (Product, CartItem)

productService.ts
├── Types (Product, ApiResponse)
├── products.json
└── No external dependencies (uses built-in fetch/Axios)
```

---

## 🔌 API Integration Points

Currently using mock API. Easy to switch to real API:

```
productService.ts (Current)
├── getAllProducts() → products.json
├── getProductById(id) → products.json
├── getProductsByCategory(category) → products.json
├── searchProducts(query) → products.json
├── getCategories() → products.json
└── processCheckout() → mock response

To use real API, replace with:
├── getAllProducts() → GET /api/products
├── getProductById(id) → GET /api/products/:id
├── getProductsByCategory(category) → GET /api/products?category=...
├── searchProducts(query) → GET /api/products?search=...
├── getCategories() → GET /api/categories
└── processCheckout() → POST /api/orders
```

---

## 🗂️ File Organization Logic

```
src/
├── pages/              Contains full page components
│   └── Each page implements specific route
├── components/         Reusable across pages
│   └── Each component has single responsibility
├── context/            Global state management
│   └── Provides hooks for consumption
├── services/           API layer abstraction
│   └── Centralized data fetching
├── data/               Mock data
│   └── JSON files with static data
├── types/              TypeScript types
│   └── Shared interfaces
├── styles/             CSS modules
│   └── Each file for specific component/feature
└── App.tsx             Root application component
```

---

## 🧪 Testing Integration Points

```
Each component/page has data-testid attributes for:

├─ Query Elements (automation testing)
│  └─ await page.locator('[data-testid="..."]')
│
├─ User Interactions
│  ├─ Click buttons
│  ├─ Fill forms
│  └─ Verify state changes
│
├─ Navigation
│  └─ Verify route changes
│
├─ State Management
│  └─ Verify context updates
│
└─ API Calls
   └─ Mock productService for unit tests
```

---

## ⚡ Performance Optimizations

```
Vite
├─ Fast HMR
├─ Code splitting
├─ Tree shaking
└─ Optimized builds

React
├─ Functional components
├─ Context for state (avoids prop drilling)
├─ Lazy routes (ready)
└─ Memoization (ready)

CSS
├─ CSS variables for theming
├─ No unused CSS
├─ Optimized media queries
└─ Minified in production

Images
├─ Placeholder URLs
├─ Can use CDN
└─ Lazy loading ready
```

---

## 🚀 Deployment Architecture

```
Production Build Process:
    │
    ├─ npm run build
    │  ├─ TypeScript compilation
    │  ├─ Vite bundling
    │  ├─ CSS minification
    │  ├─ JS minification (Terser)
    │  └─ Create dist/ folder
    │
    └─ Deploy dist/ to:
       ├─ Web server (Apache/Nginx)
       ├─ CDN (CloudFront/Cloudflare)
       ├─ Static host (Vercel/Netlify)
       └─ Cloud storage (S3/GCS)
```

---

## 📊 Technology Stack

```
Frontend Framework
├─ React 18.2 (UI library)
├─ TypeScript 5.3 (Type safety)
└─ Vite 5.0 (Build tool)

Routing
└─ React Router 6.20

HTTP Client
└─ Axios 1.6

Styling
└─ CSS3 (Custom Properties)

Development Tools
├─ ESLint (Code quality)
├─ TypeScript Compiler (Type checking)
└─ Vite Dev Server (Hot reload)

Testing Ready
├─ data-testid attributes (all elements)
├─ Playwright compatible
├─ Cypress compatible
└─ Puppeteer compatible
```

---

## 🎯 Key Design Patterns

```
Service Layer Pattern
└─ productService abstracts API calls

Context API Pattern
└─ CartContext for global cart state

Component Composition
└─ Small components composed to form pages

Custom Hooks Pattern
└─ useCart hook for context consumption

Mock API Pattern
└─ JSON data simulates API responses

Responsive Design Pattern
└─ Mobile-first CSS with media queries
```

---

## 📈 Scalability Points

```
Ready to Scale:
├─ API layer separation (easy to swap)
├─ Context providers (can add more)
├─ Component structure (easy to add new pages)
├─ Styling system (CSS variables for themes)
├─ Testing framework (data-testid coverage)
└─ Build process (Vite handles complexity)

Easy Extensions:
├─ Add new pages (follow page pattern)
├─ Add components (follow component pattern)
├─ Add context (follow CartContext pattern)
├─ Add API methods (extend productService)
├─ Add styles (new CSS file)
└─ Add types (extend types/index.ts)
```

---

**Architecture Complete** ✅
**All Components Connected** ✅
**Ready for Development** ✅
**Ready for Testing** ✅
**Ready for Production** ✅
