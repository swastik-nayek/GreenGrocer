const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToCartValidation,
    updateCartValidation
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCartValidation, addToCart);
router.put('/:productId', authenticateToken, updateCartValidation, updateCartItem);
router.delete('/:productId', authenticateToken, removeFromCart);
router.delete('/', authenticateToken, clearCart);

module.exports = router;