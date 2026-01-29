import api from './api';

export const matchService = {
    getAll: async (params) => {
        const response = await api.get('/matches', { params });
        return response.data;
    },
    getLive: async () => {
        const response = await api.get('/matches/live');
        return response.data;
    },
    getUpcoming: async (limit) => {
        const response = await api.get('/matches/upcoming', { params: { limit } });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/matches/${id}`);
        return response.data;
    },
    syncMatches: async (leagueId, season) => {
        const response = await api.post(`/matches/sync/${leagueId}/${season}`);
        return response.data;
    }
};
