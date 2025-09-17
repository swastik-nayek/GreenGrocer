import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-btn"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-btn">
        🔍
      </button>
    </form>
  );
};

export default SearchBar;