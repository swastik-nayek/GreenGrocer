// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAll({ limit: 8 }),
          categoriesAPI.getAll()
        ]);

        // Handle featured products
        const productsData = productsResponse.data;
        if (productsData?.products) {
          setFeaturedProducts(productsData.products);
        } else if (productsData?.data?.products) {
          setFeaturedProducts(productsData.data.products);
        } else {
          setFeaturedProducts([]);
        }

        // Handle categories
        const categoriesData = categoriesResponse.data;
        if (categoriesData?.data?.categories) {
          setCategories(categoriesData.data.categories);
        } else {
          setCategories([]);
        }

      } catch (error) {
        console.error('Error fetching home data:', error);
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Fresh Groceries Delivered to Your Door</h1>
          <p>Shop from our wide selection of fresh produce, pantry essentials, and household items.</p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.length > 0 ? (
              categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/products?category=${category.id}`} 
                  className={`category-card ${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="category-icon">{getCategoryIcon(category.name)}</div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </Link>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
          <div className="text-center">
            <Link to="/products" className="view-all-button">View All Products</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// Simple icons for categories
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Vegetables': '🥕',
    'Fruits': '🍎',
    'Home Accessories': '🏠',
    'Others': '🧂'
  };
  return icons[categoryName] || '📦';
};

export default Home;
