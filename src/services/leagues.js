import api from './api';

export const leagueService = {
    getAll: async (params) => {
        const response = await api.get('/leagues', { params });
        return response.data;
    },
    getFeatured: async () => {
        const response = await api.get('/leagues/featured');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/leagues/${id}`);
        return response.data;
    },
    follow: async (id) => {
        const response = await api.post(`/leagues/${id}/follow`);
        return response.data;
    },
    syncLeagues: async () => {
        const response = await api.post('/leagues/sync');
        return response.data;
    }
};
