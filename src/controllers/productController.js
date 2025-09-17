const { body, validationResult, query } = require('express-validator');
const { pool } = require('../models/database');

const getAllProducts = async (req, res) => {
    try {
        // Parse and validate limit/page as integers
        let limit = parseInt(req.query.limit, 10);
        let page = parseInt(req.query.page, 10);

        if (isNaN(limit) || limit <= 0) limit = 10;
        if (isNaN(page) || page <= 0) page = 1;

        const offset = (page - 1) * limit;

        console.log('Products pagination:', { limit, page, offset });

        let products;

        try {
            // Try with placeholders
            [products] = await pool.execute(
                `
                    SELECT p.*, c.name as category_name
                    FROM products p
                    JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = TRUE
                    ORDER BY p.created_at DESC
                    LIMIT ? OFFSET ?
                `,
                [limit, offset]
            );
        } catch (err) {
            console.warn(
                "Falling back to inline LIMIT/OFFSET due to MySQL2 error:",
                err.message
            );
            [products] = await pool.query(
                `
                    SELECT p.*, c.name as category_name
                    FROM products p
                    JOIN categories c ON p.category_id = c.id
                    WHERE p.is_active = TRUE
                    ORDER BY p.created_at DESC
                    LIMIT ${limit} OFFSET ${offset}
                `
            );
        }

        console.log("Products fetched:", products.length);
        res.json({
            success: true,
            data: products,
            total: products.length,
            message: 'Products fetched successfully'
        });
    } catch (err) {
        console.error("Get products error:", err);
        res.status(500).json({ error: err.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.execute(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             JOIN categories c ON p.category_id = c.id 
             WHERE p.id = ? AND p.is_active = TRUE`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                product: products[0]
            }
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, description, price, categoryId, stock } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.execute(
            'INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, categoryId, stock, imageUrl]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                productId: result.insertId
            }
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Validation rules
const productValidation = [
    body('name').notEmpty().trim().withMessage('Product name is required'),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').isInt({ min: 1 }).withMessage('Valid category ID is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

const queryValidation = [
    query('category').optional().isInt({ min: 1 }),
    query('search').optional().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
];

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    productValidation,
    queryValidation
};