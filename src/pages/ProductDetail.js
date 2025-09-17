import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Added to cart successfully!');
    } else {
      alert('Failed to add to cart: ' + result.error);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Products
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="placeholder-image">📦</div>
            )}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <p className="category">{product.category_name}</p>
            <p className="price">${product.price.toFixed(2)}</p>

            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="stock-info">
              <p>{product.stock} items in stock</p>
            </div>

            {product.stock > 0 ? (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-btn">
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            ) : (
              <div className="out-of-stock">
                <p>This item is currently out of stock</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;