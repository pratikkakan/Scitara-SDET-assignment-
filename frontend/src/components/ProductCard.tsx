import { Link } from 'react-router-dom';
import { Product } from '../types';
import '../styles/product-card.css';

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard = ({ product, onQuickAdd }: ProductCardProps) => {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickAdd && product.inStock) {
      onQuickAdd(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`} data-testid={`product-card-${product.id}`}>
      <div className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.name} data-testid={`product-image-${product.id}`} />
          {!product.inStock && (
            <div className="stock-badge" data-testid={`out-of-stock-${product.id}`}>
              Out of Stock
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>

          <p className="product-category" data-testid={`product-category-${product.id}`}>
            {product.category}
          </p>

          <p className="product-description" data-testid={`product-description-${product.id}`}>
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </p>

          <div className="product-footer">
            <div className="price-rating">
              <span className="price" data-testid={`product-price-${product.id}`}>
                ${product.price.toFixed(2)}
              </span>
              <span className="rating" data-testid={`product-rating-${product.id}`}>
                ⭐ {product.rating}
              </span>
            </div>

            {product.inStock && onQuickAdd && (
              <button
                className="quick-add-btn"
                onClick={handleQuickAdd}
                data-testid={`quick-add-${product.id}`}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
