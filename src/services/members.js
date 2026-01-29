import api from './api';

export const memberService = {
    // GET all members
    async getAll(filters = {}) {
        try {
            const response = await api.get('/members', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching members:', error);
            // Fallback to empty array to prevent crash if backend down
            return [];
        }
    },

    // GET member by ID
    async getById(id) {
        try {
            const response = await api.get(`/members/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching member:', error);
            throw error;
        }
    },

    // CREATE new member
    async create(memberData) {
        try {
            const response = await api.post('/members', memberData);
            return response.data;
        } catch (error) {
            console.error('Error creating member:', error);
            throw error;
        }
    },

    // UPDATE member
    async update(id, memberData) {
        try {
            const response = await api.patch(`/members/${id}`, memberData);
            return response.data;
        } catch (error) {
            console.error('Error updating member:', error);
            throw error;
        }
    },

    // DELETE member
    async delete(id) {
        try {
            const response = await api.delete(`/members/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting member:', error);
            throw error;
        }
    },

    // GET stats
    async getStats() {
        try {
            const response = await api.get('/members/api/stats'); // Note: weird path in guide, assuming backend handles relative
            return response.data;
        } catch (error) {
            // console.error('Error fetching stats:', error);
            return { total: 0, active: 0 };
        }
    },
};
