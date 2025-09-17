import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // get ?category= from URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category") || "";

  useEffect(() => {
    axios.get(`${API}/products`, {
      params: { page, limit: 12, category: selectedCategory || undefined }
    })
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(err => console.error("Products fetch error:", err));
  }, [selectedCategory, page]);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "green" }}>{selectedCategory || "All Products"}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {products.map(prod => (
          <div key={prod.id} style={{ background: "#111", padding: "10px", borderRadius: "8px" }}>
            <h3>{prod.name}</h3>
            <p>{prod.category}</p>
            <p>₹{prod.price}</p>
            <button style={{ background: "green", color: "#fff", padding: "5px 10px" }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i+1} 
            onClick={() => setPage(i+1)} 
            style={{ margin: "0 5px", background: page === i+1 ? "green" : "white", color: page === i+1 ? "white" : "black" }}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}
