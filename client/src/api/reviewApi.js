import api from './axios';

export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`);
export const createReview = (productId, data) => api.post(`/reviews/product/${productId}`, data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const getAllReviews = (params) => api.get('/reviews', { params });
export const approveReview = (id, isApproved) => api.put(`/reviews/${id}/approve`, { isApproved });
