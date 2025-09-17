const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '86099093',
    database: 'grocery_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true // ✅ forces DECIMAL to be returned as Number
};

const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };