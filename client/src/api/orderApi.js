import api from './axios';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = (params) => api.get('/orders/my-orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id, data) => api.post(`/orders/${id}/cancel`, data);
export const getAllOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
