const { pool } = require('../models/database');

const getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories ORDER BY name ASC'
        );

        res.json({
            success: true,
            data: {
                categories
            },
            message: 'Categories fetched successfully'
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [categories] = await pool.execute(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: categories[0],
            message: 'Category fetched successfully'
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById
};