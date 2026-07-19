import api from './axios';

export const getWorkTypes = () => api.get('/work-types');
export const createWorkType = (data) => api.post('/work-types', data);
export const updateWorkType = (id, data) => api.put(`/work-types/${id}`, data);
export const deleteWorkType = (id) => api.delete(`/work-types/${id}`);
