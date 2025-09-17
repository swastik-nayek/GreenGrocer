const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getOrderById,
    createOrderValidation
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', authenticateToken, createOrderValidation, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

module.exports = router;