import api from './axios';

export const getSummary = () => api.get('/analytics/summary');
export const getRevenueOverTime = (days) => api.get('/analytics/revenue-over-time', { params: { days } });
export const getTopProducts = () => api.get('/analytics/top-products');
export const getOrdersByStatus = () => api.get('/analytics/orders-by-status');
export const getLowStock = (threshold) => api.get('/analytics/low-stock', { params: { threshold } });
