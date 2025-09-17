const { body, validationResult } = require('express-validator');
const { pool } = require('../models/database');

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const [cartItems] = await pool.execute(
            `SELECT c.*, p.name, p.price, p.image_url, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [userId]
        );

        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                totalAmount: parseFloat(totalAmount.toFixed(2)),
                itemCount: cartItems.length
            },
            message: 'Cart fetched successfully'
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Check if product exists and is active
        const [products] = await pool.execute(
            'SELECT id, stock FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Check if item already exists in cart
        const [existingItems] = await pool.execute(
            'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existingItems.length > 0) {
            // Update quantity
            const newQuantity = existingItems[0].quantity + quantity;

            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock'
                });
            }

            await pool.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, userId, productId]
            );
        } else {
            // Add new item
            await pool.execute(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
        }

        res.json({
            success: true,
            data: null,
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        const [result] = await pool.execute(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({
            success: true,
            data: null,
            message: 'Cart item updated successfully'
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({
            success: true,
            data: null,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.execute(
            'DELETE FROM cart WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            data: null,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Validation rules
const addToCartValidation = [
    body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToCartValidation,
    updateCartValidation
};