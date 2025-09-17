import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Account</h1>
          <p>Welcome back, {user?.firstName || user?.first_name || 'User'}!</p>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <span>{(user?.firstName || user?.first_name || '') + ' ' + (user?.lastName || user?.last_name || '')}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Account Type</label>
                  <span className="role">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="orders-section">
              <h3>Recent Orders</h3>
              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h4>Order #{order.id}</h4>
                        <span className={`status ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.total_amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <a href="/products" className="shop-link">Start Shopping</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;