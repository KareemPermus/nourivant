import axios from 'axios';

const API_BASE_URL = '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const recipeApi = {
  list: (params?: { search?: string; category?: string }) =>
    apiClient.get('/api/recipes', { params }),
  get: (id: number) =>
    apiClient.get(`/api/recipes/${id}`),
  create: (data: any) =>
    apiClient.post('/api/recipes', data),
  update: (id: number, data: any) =>
    apiClient.put(`/api/recipes/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/recipes/${id}`),
};

export const statsApi = {
  get: () => apiClient.get('/api/stats'),
};

export default apiClient;