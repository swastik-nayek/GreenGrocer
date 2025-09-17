import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'Credit Card'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ordersAPI.create(formData);
      if (response.data.success) {
        await clearCart();
        alert('Order placed successfully!');
        navigate('/profile');
      }
    } catch (error) {
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
            <p>Add some items to checkout</p>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="shippingAddress">Full Address</label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Enter your complete shipping address..."
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="form-group">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - $${totalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map(item => (
                <div key={item.product_id} className="order-item">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ${totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;