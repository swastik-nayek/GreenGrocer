const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { pool } = require('../models/database');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, phone || null]
        );

        // Generate token
        const token = generateToken({ userId: result.insertId });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: result.insertId,
                    email,
                    firstName,
                    lastName,
                    role: 'customer'
                },
                token
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Get user from database
        const [users] = await pool.execute(
            'SELECT id, email, password, first_name, last_name, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken({ userId: user.id });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role
                },
                token
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            message: 'Profile fetched successfully'
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('phone').optional().isMobilePhone()
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

module.exports = {
    register,
    login,
    getProfile,
    registerValidation,
    loginValidation
};