import api from './axios';

export const getOccasions = () => api.get('/occasions');
export const createOccasion = (data) => api.post('/occasions', data);
export const updateOccasion = (id, data) => api.put(`/occasions/${id}`, data);
export const deleteOccasion = (id) => api.delete(`/occasions/${id}`);
