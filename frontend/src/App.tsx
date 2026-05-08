import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components';
import { ProductListing, ProductDetails, Cart, Checkout } from './pages';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app" data-testid="app">
          <Header />
          <main className="main-content" data-testid="main-content">
            <Routes>
              <Route path="/" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<ProductListing />} />
            </Routes>
          </main>
          <footer className="footer" data-testid="footer">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
