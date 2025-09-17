import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAll({ limit: 50 }),
        categoriesAPI.getAll()
      ]);
      setProducts(productsResponse.data.data.products || []);
      setCategories(categoriesResponse.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your grocery store</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products ({products.length})
          </button>
          <button 
            className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'products' && (
            <div className="products-management">
              <div className="section-header">
                <h3>Product Management</h3>
                <button className="add-btn">Add New Product</button>
              </div>

              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category_name}</td>
                        <td>${product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button className="edit-btn">Edit</button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="categories-management">
              <div className="section-header">
                <h3>Category Management</h3>
                <button className="add-btn">Add New Category</button>
              </div>

              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className="category-card">
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                    <div className="card-actions">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;