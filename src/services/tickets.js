import api from './api';

export const ticketService = {
    // GET all tickets for current user
    async getAll() {
        try {
            const response = await api.get('/tickets');
            return response.data;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
    },

    // GET ticket by ID
    async getById(id) {
        try {
            const response = await api.get(`/tickets/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw error;
        }
    },

    // VALIDATE ticket by ID (for scanner)
    async validate(ticketId) {
        try {
            const response = await api.post(`/tickets/${ticketId}/validate`);
            return response.data;
        } catch (error) {
            console.error('Error validating ticket:', error);
            throw error;
        }
    },

    // PURCHASE ticket for event
    async purchase(eventId, type = 'Standard') {
        try {
            const response = await api.post('/tickets/purchase', { eventId, type });
            return response.data;
        } catch (error) {
            console.error('Error purchasing ticket:', error);
            throw error;
        }
    }
};
