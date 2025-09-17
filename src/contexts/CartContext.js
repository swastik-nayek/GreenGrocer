import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.itemCount || 0,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
        itemCount: 0
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, token } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, token]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartAPI.addToCart(productId, quantity);
      await loadCart(); // Reload cart to get updated data
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await cartAPI.updateCartItem(productId, quantity);
      await loadCart(); // Reload to get updated totals
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      await loadCart(); // Reload to get updated totals
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};