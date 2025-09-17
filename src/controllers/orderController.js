const { body, validationResult } = require('express-validator');
const { pool } = require('../models/database');

const createOrder = async (req, res) => {
    const connection = await pool.getConnection();

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
        const { shippingAddress, paymentMethod } = req.body;

        await connection.beginTransaction();

        // Get cart items
        const [cartItems] = await connection.execute(
            `SELECT c.*, p.name, p.price, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Check stock availability
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        // Calculate total
        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Create order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
            [userId, totalAmount, shippingAddress, paymentMethod]
        );

        const orderId = orderResult.insertId;

        // Create order items and update stock
        for (const item of cartItems) {
            // Add order item
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update product stock
            await connection.execute(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await connection.execute(
            'DELETE FROM cart WHERE user_id = ?',
            [userId]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            data: {
                orderId: orderId,
                totalAmount: totalAmount
            },
            message: 'Order created successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        connection.release();
    }
};

const getUserOrders = async (req, res) => {
    try {

        const userId = req.user.id;
        let page = parseInt(req.query.page, 10);
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(page) || page <= 0) page = 1;
        if (isNaN(limit) || limit <= 0) limit = 10;
        const offset = (page - 1) * limit;

        // Use inline LIMIT/OFFSET for MySQL2 compatibility
        const [orders] = await pool.query(
            `SELECT o.* FROM orders o
             WHERE o.user_id = ?
             ORDER BY o.created_at DESC
             LIMIT ${limit} OFFSET ${offset}`,
            [userId]
        );

        // Get total count
        const [countResult] = await pool.execute(
            'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(countResult[0].total / limit),
                    totalItems: countResult[0].total,
                    itemsPerPage: parseInt(limit)
                }
            },
            message: 'Orders fetched successfully'
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: orders[0],
            message: 'Order fetched successfully'
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Validation rules
const createOrderValidation = [
    body('shippingAddress').notEmpty().trim().withMessage('Shipping address is required'),
    body('paymentMethod').notEmpty().trim().withMessage('Payment method is required')
];

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    createOrderValidation
};