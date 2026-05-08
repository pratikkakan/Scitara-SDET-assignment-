import { useEffect, useState } from 'react';
import { ProductCard, LoadingSpinner, EmptyState } from '../components';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import productService from '../services/productService';
import '../styles/product-listing.css';

export const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          productService.getCategories(),
        ]);
        setProducts(productsData);
        setCategories(['All', ...categoriesData]);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } else {
      const results = await productService.searchProducts(query);
      setProducts(results);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      let filtered: Product[];
      if (category === 'All') {
        filtered = await productService.getAllProducts();
      } else {
        filtered = await productService.getProductsByCategory(category);
      }
      setProducts(filtered);
    } catch (err) {
      setError('Failed to filter products.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, 1);
    // Show success feedback
    alert(`${product.name} added to cart!`);
  };

  if (error) {
    return (
      <EmptyState
        title="Oops!"
        message={error}
        icon="❌"
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="product-listing" data-testid="product-listing">
      <div className="listing-header">
        <h2>Our Products</h2>
        <p>Browse our collection of high-quality tech products</p>
      </div>

      <div className="listing-controls">
        <div className="search-box" data-testid="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            data-testid="search-input"
          />
        </div>

        <div className="category-filter" data-testid="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category)}
              data-testid={`category-${category}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          message="Try adjusting your search or filters"
          icon="🔍"
        />
      ) : (
        <>
          <div className="products-count" data-testid="products-count">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
          <div className="products-grid" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
