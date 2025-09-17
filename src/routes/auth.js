const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    registerValidation,
    loginValidation
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;