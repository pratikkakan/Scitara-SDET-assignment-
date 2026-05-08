import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { EmptyState } from "../components";
import "../styles/cart.css";

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveItem = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 300);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <div className="cart-page" data-testid="cart-page">
        <EmptyState
          title="Your Cart is Empty"
          message="Start shopping and add some items to your cart"
          icon="🛒"
          action={{
            label: "Continue Shopping",
            onClick: handleContinueShopping,
          }}
        />
      </div>
    );
  }

  const total = getTotalPrice();
  const tax = total * 0.1; // 10% tax
  const shipping = items.length > 0 ? 10 : 0;
  const finalTotal = total + tax + shipping;

  return (
    <div className="cart-page" data-testid="cart-page">
      <div className="cart-container">
        <h1 data-testid="cart-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="items-header" data-testid="items-header">
              <span>Items ({items.length})</span>
            </div>

            <div className="cart-items" data-testid="cart-items">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item ${removingId === item.id ? "removing" : ""}`}
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      data-testid={`item-image-${item.id}`}
                    />
                  </div>

                  <div className="item-details">
                    <h3 data-testid={`item-name-${item.id}`}>{item.name}</h3>
                    <p
                      className="item-category"
                      data-testid={`item-category-${item.id}`}
                    >
                      {item.category}
                    </p>
                    <p
                      className="item-price"
                      data-testid={`item-unit-price-${item.id}`}
                    >
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.cartQuantity - 1)
                      }
                      disabled={item.cartQuantity <= 1}
                      data-testid={`decrease-${item.id}`}
                    >
                      −
                    </button>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.cartQuantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1,
                        )
                      }
                      data-testid={`quantity-${item.id}`}
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.cartQuantity + 1)
                      }
                      data-testid={`increase-${item.id}`}
                    >
                      +
                    </button>
                  </div>

                  <div
                    className="item-total"
                    data-testid={`item-total-${item.id}`}
                  >
                    ${(item.price * item.cartQuantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    data-testid={`remove-${item.id}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              className="clear-cart-btn"
              onClick={clearCart}
              data-testid="clear-cart-button"
            >
              Clear Cart
            </button>
          </div>

          <div className="cart-summary" data-testid="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-line">
              <span>Subtotal:</span>
              <span data-testid="subtotal">${total.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Tax (10%):</span>
              <span data-testid="tax">${tax.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping:</span>
              <span data-testid="shipping">${shipping.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-line total">
              <span>Total:</span>
              <span data-testid="total-price">${finalTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </button>

            <button
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
