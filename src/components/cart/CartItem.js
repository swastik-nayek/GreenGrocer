import React from 'react';
import { useCart } from '../../contexts/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(item.product_id);
    } else {
      await updateCartItem(item.product_id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.product_id);
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} />
        ) : (
          <div className="placeholder">📦</div>
        )}
      </div>

      <div className="item-details">
        <h4>{item.name}</h4>
        <p className="item-price">${item.price.toFixed(2)} each</p>
        <p className="item-stock">Stock: {item.stock}</p>
      </div>

      <div className="item-quantity">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>

      <div className="item-total">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button className="remove-btn" onClick={handleRemove}>
        ✕
      </button>
    </div>
  );
};

export default CartItem;