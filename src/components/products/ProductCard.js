import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    const result = await addToCart(product.id, 1);
    if (result.success) {
      alert('Added to cart successfully!');
    } else {
      alert('Failed to add to cart: ' + result.error);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="placeholder-image">
              {getProductIcon(product.category_name)}
            </div>
          )}
          {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category_name}</p>
          <p className="product-description">{product.description}</p>

          <div className="product-footer">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className="product-stock">{product.stock} in stock</span>
          </div>
        </div>
      </Link>

      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

const getProductIcon = (categoryName) => {
  const icons = {
    'Vegetables': '🥕',
    'Fruits': '🍎',
    'Home Accessories': '🏠',
    'Others': '🧂'
  };
  return icons[categoryName] || '📦';
};

export default ProductCard;