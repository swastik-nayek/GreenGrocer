const express = require('express');
const router = express.Router();
const { pool } = require('../models/database');

// GET /api/products?page=1&limit=12&category=2
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1";
    const values = [];

    // Filter by category ID if provided
    if (category) {
      query += " AND p.category_id = ?";
      values.push(category);
    }

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    values.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, values);

    // Get total items for pagination
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE is_active = 1";
    const countValues = [];
    if (category) {
      countQuery += " AND category_id = ?";
      countValues.push(category);
    }

    const [countRows] = await pool.query(countQuery, countValues);
    const totalItems = countRows[0].total;

    res.json({
      products: rows,
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems
    });

  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

module.exports = router;
