-- Sample data for Grocery E-commerce Platform
USE grocery_ecommerce;

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Vegetables', 'Fresh vegetables', '/images/vegetables.jpg'),
('Fruits', 'Fresh fruits', '/images/fruits.jpg'),
('Home Accessories', 'Kitchen and home items', '/images/accessories.jpg'),
('Others', 'Spices, beverages and more', '/images/others.jpg');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, stock, image_url) VALUES
-- Vegetables
('Fresh Tomatoes', 'Organic red tomatoes, perfect for salads and cooking', 2.99, 1, 50, '/images/tomatoes.jpg'),
('Potatoes', 'Farm fresh potatoes, great for frying and boiling', 1.99, 1, 100, '/images/potatoes.jpg'),
('Onions', 'Yellow onions, essential for cooking', 1.49, 1, 75, '/images/onions.jpg'),
('Carrots', 'Orange carrots, rich in vitamins', 1.79, 1, 60, '/images/carrots.jpg'),
('Spinach', 'Fresh spinach leaves, packed with iron', 2.49, 1, 40, '/images/spinach.jpg'),
('Broccoli', 'Green broccoli, high in nutrients', 3.49, 1, 30, '/images/broccoli.jpg'),

-- Fruits  
('Fresh Apples', 'Red delicious apples, crispy and sweet', 3.49, 2, 40, '/images/apples.jpg'),
('Bananas', 'Ripe yellow bananas, rich in potassium', 1.99, 2, 80, '/images/bananas.jpg'),
('Oranges', 'Juicy oranges, high in vitamin C', 2.99, 2, 55, '/images/oranges.jpg'),
('Grapes', 'Sweet green grapes', 4.99, 2, 25, '/images/grapes.jpg'),
('Strawberries', 'Fresh strawberries, perfect for desserts', 5.99, 2, 20, '/images/strawberries.jpg'),
('Mangoes', 'Sweet ripe mangoes', 6.99, 2, 15, '/images/mangoes.jpg'),

-- Home Accessories
('Kitchen Utensils Set', 'Complete cooking utensil set with spatula, ladle, and more', 29.99, 3, 20, '/images/utensils.jpg'),
('Storage Containers', 'Food storage containers, BPA-free plastic', 19.99, 3, 30, '/images/containers.jpg'),
('Cleaning Supplies', 'All-purpose cleaning supplies for kitchen', 15.99, 3, 25, '/images/cleaning.jpg'),
('Cutting Board', 'Bamboo cutting board, eco-friendly', 24.99, 3, 15, '/images/cutting-board.jpg'),

-- Others
('Spice Mix', 'Indian spice mix, aromatic blend', 4.99, 4, 25, '/images/spices.jpg'),
('Green Tea', 'Organic green tea bags', 8.99, 4, 35, '/images/tea.jpg'),
('Trail Mix', 'Mixed nuts and dried fruits', 12.99, 4, 20, '/images/trail-mix.jpg'),
('Olive Oil', 'Extra virgin olive oil, 500ml', 18.99, 4, 10, '/images/olive-oil.jpg');

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@greengrocer.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LYWJeI3WtQ8F.RoGu', 'Admin', 'User', 'admin');

-- Insert sample customer (password: customer123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('customer@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'customer');