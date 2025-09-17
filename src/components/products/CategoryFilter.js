import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories = [], selectedCategory, onCategorySelect }) => {
  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <div className="filter-options">
        <button
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onCategorySelect('')}
        >
          All Products
        </button>
        {categories?.length > 0 ? (
          categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
              onClick={() => onCategorySelect(category.id.toString())}
            >
              <span className="category-icon">
                {getCategoryIcon(category.name)}
              </span>
              {category.name}
            </button>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

const getCategoryIcon = (categoryName) => {
  const icons = {
    'Vegetables': '🥕',
    'Fruits': '🍎',
    'Home Accessories': '🏠',
    'Others': '🧂'
  };
  return icons[categoryName] || '📦';
};

export default CategoryFilter;