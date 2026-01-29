import api from './api';

export const eventService = {
    // GET all events
    async getAll(filters = {}) {
        try {
            const response = await api.get('/events', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    },

    // GET event by ID
    async getById(id) {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    },

    // CREATE event
    async create(eventData) {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },

    // GET stats (mock for now if endpoint missing)
    async getStats() {
        // Mock stats or call API if exists
        return {
            total: 12,
            attendees: 2450,
            free: 4
        };
    }
};
