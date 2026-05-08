import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/header.css";

export const Header = () => {
  const { getTotalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header" data-testid="header">
      <div className="header-container">
        <Link to="/" className="logo" data-testid="logo">
          <h1>TechStore</h1>
        </Link>

        <nav className="nav" data-testid="navigation">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            data-testid="nav-products"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className={`nav-link ${isActive("/cart") ? "active" : ""}`}
            data-testid="nav-cart"
          >
            Cart
            {getTotalItems() > 0 && (
              <span className="cart-badge" data-testid="cart-count">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};
