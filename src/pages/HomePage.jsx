import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/categories`)
      .then(res => setCategories(res.data.data.categories || res.data.categories || []))
      .catch(err => console.error("Categories fetch error:", err));
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "green" }}>🛒 Grocery Shop</h1>
      <h2>Shop by Category</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {categories.map(cat => (
          <Link 
            to={`/products?category=${cat.name}`} 
            key={cat.id} 
            style={{ 
              background: "#111", 
              padding: "20px", 
              borderRadius: "10px", 
              textAlign: "center",
              color: "white",
              textDecoration: "none"
            }}
          >
            <h3 style={{ color: "green" }}>{cat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
