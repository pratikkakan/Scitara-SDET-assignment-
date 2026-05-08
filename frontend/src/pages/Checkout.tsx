import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { LoadingSpinner, EmptyState } from '../components';
import { CheckoutFormData } from '../types';
import productService from '../services/productService';
import '../styles/checkout.css';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Redirect if no items in cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <EmptyState
        title="No Items to Checkout"
        message="Your cart is empty. Please add items before proceeding."
        icon="📭"
        action={{
          label: 'Back to Products',
          onClick: () => navigate('/'),
        }}
      />
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-confirmation" data-testid="order-confirmation">
        <div className="confirmation-card">
          <div className="success-icon">✓</div>
          <h1 data-testid="order-success-title">Order Placed Successfully!</h1>
          <p className="confirmation-message" data-testid="confirmation-message">
            Thank you for your purchase.
          </p>
          <div className="order-id" data-testid="order-id">
            <span>Order ID:</span>
            <strong>{orderId}</strong>
          </div>
          <p className="delivery-message">
            Your order will be delivered within 3-5 business days.
          </p>
          <button
            className="continue-btn"
            onClick={() => navigate('/')}
            data-testid="back-home-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.match(/^\d{10,}$/)) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.match(/^\d{5,}$/)) {
      newErrors.zipCode = 'Valid zip code is required';
    }
    if (!formData.cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Valid card number is required (16 digits)';
    }
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Valid CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await productService.processCheckout(items, getTotalPrice(), formData);

      if (response.success && response.data?.orderId) {
        setOrderId(response.data.orderId);
        clearCart();
        setOrderPlaced(true);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  const total = getTotalPrice();
  const tax = total * 0.1;
  const shipping = 10;
  const finalTotal = total + tax + shipping;

  if (loading) {
    return <LoadingSpinner message="Processing your order..." />;
  }

  return (
    <div className="checkout-page" data-testid="checkout-page">
      <div className="checkout-container">
        <h1 data-testid="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form" data-testid="checkout-form">
              {/* Billing Address Section */}
              <fieldset>
                <legend>Billing Address</legend>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      data-testid="firstName-input"
                    />
                    {errors.firstName && (
                      <span className="error-message" data-testid="firstName-error">
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      data-testid="lastName-input"
                    />
                    {errors.lastName && (
                      <span className="error-message" data-testid="lastName-error">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <span className="error-message" data-testid="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    data-testid="phone-input"
                  />
                  {errors.phone && (
                    <span className="error-message" data-testid="phone-error">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    data-testid="address-input"
                  />
                  {errors.address && (
                    <span className="error-message" data-testid="address-error">
                      {errors.address}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      data-testid="city-input"
                    />
                    {errors.city && (
                      <span className="error-message" data-testid="city-error">
                        {errors.city}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code *</label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                      data-testid="zipCode-input"
                    />
                    {errors.zipCode && (
                      <span className="error-message" data-testid="zipCode-error">
                        {errors.zipCode}
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Payment Information Section */}
              <fieldset>
                <legend>Payment Information</legend>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    placeholder="1234567890123456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={errors.cardNumber ? 'error' : ''}
                    data-testid="cardNumber-input"
                  />
                  {errors.cardNumber && (
                    <span className="error-message" data-testid="cardNumber-error">
                      {errors.cardNumber}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      id="expiryDate"
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={errors.expiryDate ? 'error' : ''}
                      data-testid="expiryDate-input"
                    />
                    {errors.expiryDate && (
                      <span className="error-message" data-testid="expiryDate-error">
                        {errors.expiryDate}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={errors.cvv ? 'error' : ''}
                      data-testid="cvv-input"
                    />
                    {errors.cvv && (
                      <span className="error-message" data-testid="cvv-error">
                        {errors.cvv}
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/cart')}
                  data-testid="cancel-button"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={loading}
                  data-testid="place-order-button"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          <div className="order-review" data-testid="order-review">
            <h2>Order Review</h2>

            <div className="review-items">
              {items.map((item) => (
                <div key={item.id} className="review-item" data-testid={`review-item-${item.id}`}>
                  <div className="review-item-info">
                    <span className="item-name" data-testid={`review-item-name-${item.id}`}>
                      {item.name}
                    </span>
                    <span className="item-qty" data-testid={`review-item-qty-${item.id}`}>
                      Qty: {item.cartQuantity}
                    </span>
                  </div>
                  <span className="item-price" data-testid={`review-item-price-${item.id}`}>
                    ${(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="review-divider"></div>

            <div className="review-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span data-testid="review-subtotal">${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span data-testid="review-tax">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span data-testid="review-shipping">${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span data-testid="review-total">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
