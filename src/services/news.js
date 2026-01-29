import api from './api';

export const newsService = {
    getAll: async (params) => {
        const response = await api.get('/news', { params });
        return response.data;
    },
    getFeatured: async () => {
        const response = await api.get('/news/featured');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/news/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/news', data);
        return response.data;
    },
    like: async (id) => {
        const response = await api.post(`/news/${id}/like`);
        return response.data;
    }
};
