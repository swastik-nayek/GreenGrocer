import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🥬</span>
            <span className="logo-text">GreenGrocer</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="cart-button">
                  🛒 Cart ({itemCount})
                </Link>
                <div className="user-menu">
                  <span className="user-name">Hi, {user?.firstName || user?.first_name}</span>
                  <div className="user-dropdown">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
              </div>
            )}
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;