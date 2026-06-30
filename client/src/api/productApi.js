import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (slug) => api.get(`/products/${slug}`);
export const getFeatured = () => api.get('/products/featured');
export const getNewArrivals = () => api.get('/products/new-arrivals');
export const getRelated = (id) => api.get(`/products/related/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
