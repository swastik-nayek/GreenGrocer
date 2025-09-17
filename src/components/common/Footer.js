import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🥬 GreenGrocer</h3>
            <p>Fresh groceries delivered to your door</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/categories">Categories</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/help">Help</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📧 support@greengrocer.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Green Street, Fresh City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 GreenGrocer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;