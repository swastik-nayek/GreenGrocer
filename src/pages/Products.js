// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/products/CategoryFilter';
import Pagination from '../components/common/Pagination';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1');
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products whenever filters or page change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery]);

  // -------------------- FUNCTIONS -------------------- //

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      if (res.data && res.data.data && Array.isArray(res.data.data.categories)) {
        setCategories(res.data.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Base URL
      let url = `http://localhost:5000/api/products?limit=8&page=${currentPage}`;

      // Add category filter if selected
      if (selectedCategory) url += `&category=${selectedCategory}`;

      // Add search query if provided
      if (searchQuery) url += `&search=${searchQuery}`;

      const res = await axios.get(url);
      const data = res.data;

      if (data && Array.isArray(data.products)) {
        setProducts(data.products);

        setPagination({
          currentPage: data.currentPage || currentPage,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || data.products.length,
        });
      } else {
        setProducts([]);
        setPagination({});
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  const handleSearch = (query) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  // -------------------- RENDER -------------------- //

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Products</h1>
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        <div className="products-content">
          <aside className="sidebar">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategoryFilter}
            />
          </aside>

          <main className="products-main">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <>
                <div className="products-header">
                  <p className="results-count">
                    {pagination.totalItems || 0} products found
                  </p>
                </div>

                {products.length > 0 ? (
                  <>
                    <div className="products-grid">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {pagination.totalPages > 1 && (
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                ) : (
                  <div className="no-products">
                    <p>No products found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
