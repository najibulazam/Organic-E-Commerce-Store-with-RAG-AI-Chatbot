import axios from 'axios';

// Use environment variable for API URL (production) or fallback to localhost (development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API URL for debugging (remove in production if needed)
console.log('API Base URL:', API_BASE_URL);

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products/', { params });
  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}/`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured/');
  return response.data;
};

export const getLatestProducts = async () => {
  const response = await api.get('/products/latest/');
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await api.get('/products/categories/');
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/products/categories/${slug}/`);
  return response.data;
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

// Mock function for user orders (since API doesn't have user filtering yet)
export const getUserOrders = async () => {
  // In real app with auth, use: return await getOrders();
  // For now, return mock data or all orders
  try {
    const response = await api.get('/orders/');
    return response.data;
  } catch (err) {
    return [];
  }
};

export default api;
