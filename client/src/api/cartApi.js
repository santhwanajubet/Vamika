import api from './axios';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/items', data);
export const updateCartItem = (itemId, data) => api.put(`/cart/items/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}`);
export const clearCart = () => api.delete('/cart');
export const mergeCart = (data) => api.post('/cart/merge', data);
