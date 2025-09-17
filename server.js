// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./src/models/database');

// Import routes
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const categoryRoutes = require('./src/routes/categories');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------- MIDDLEWARE ---------------------- //

// Security headers
app.use(helmet());

// Logging HTTP requests
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.2:3000'
];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------- ROUTES ---------------------- //

// Auth routes
app.use('/api/auth', authRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// ---------------------- 404 HANDLER ---------------------- //
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// ---------------------- GLOBAL ERROR HANDLER ---------------------- //
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

// ---------------------- START SERVER ---------------------- //
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
