import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (productData) => API.post('/products', productData),
  update: (id, productData) => API.put(`/products/${id}`, productData),
  delete: (id) => API.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  getById: (id) => API.get(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (productId, quantity) => API.post('/cart/add', { productId, quantity }),
  updateCartItem: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => API.delete(`/cart/${productId}`),
  clearCart: () => API.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => API.post('/orders', orderData),
  getUserOrders: (params) => API.get('/orders', { params }),
  getById: (id) => API.get(`/orders/${id}`),
};

export default API;