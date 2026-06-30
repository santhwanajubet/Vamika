import api from './axios';

export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post('/wishlist/products', { productId });
export const removeFromWishlist = (productId) => api.delete(`/wishlist/products/${productId}`);
