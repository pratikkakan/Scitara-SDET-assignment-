import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../types";
import productService from "../services/productService";
import { useCart } from "../context/CartContext";
import { LoadingSpinner, EmptyState } from "../components";
import "../styles/product-details.css";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        if (!data) {
          setError("Product not found");
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  if (loading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (error || !product) {
    return (
      <EmptyState
        title={error || "Product Not Found"}
        message="The product you're looking for doesn't exist"
        icon="❌"
        action={{
          label: "Back to Products",
          onClick: () => navigate("/"),
        }}
      />
    );
  }

  return (
    <div className="product-details" data-testid="product-details">
      <button
        className="back-btn"
        onClick={() => navigate("/")}
        data-testid="back-button"
      >
        ← Back to Products
      </button>

      <div className="details-container">
        <div className="details-image">
          <img
            src={product.image}
            alt={product.name}
            data-testid="product-detail-image"
          />
          {!product.inStock && (
            <div
              className="out-of-stock-overlay"
              data-testid="out-of-stock-overlay"
            >
              Out of Stock
            </div>
          )}
        </div>

        <div className="details-content">
          <div className="details-header">
            <h1 data-testid="product-detail-name">{product.name}</h1>
            <span
              className="category-badge"
              data-testid="product-detail-category"
            >
              {product.category}
            </span>
          </div>

          <div className="details-rating">
            <span className="stars" data-testid="product-detail-rating">
              ⭐ {product.rating} / 5.0
            </span>
          </div>

          <div className="details-price">
            <span className="price" data-testid="product-detail-price">
              ${product.price.toFixed(2)}
            </span>
            <span className="stock-status" data-testid="stock-status">
              {product.inStock ? (
                <span className="in-stock">✓ In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </span>
          </div>

          <div className="details-description">
            <h3>Description</h3>
            <p data-testid="product-detail-description">
              {product.description}
            </p>
          </div>

          {product.inStock && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  data-testid="decrease-quantity"
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  data-testid="quantity-input"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>

              <button
                className={`add-to-cart-btn ${addedToCart ? "success" : ""}`}
                onClick={handleAddToCart}
                data-testid="add-to-cart-button"
              >
                {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}

          {addedToCart && (
            <button
              className="go-to-cart-btn"
              onClick={handleGoToCart}
              data-testid="go-to-cart-button"
            >
              View Cart →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
