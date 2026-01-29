import api from './api';

export const shopService = {
    // GET all products
    async getAllProducts(filters = {}) {
        try {
            const response = await api.get('/products', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // GET product by ID
    async getProductById(id) {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // CREATE order
    async createOrder(orderData) {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // GET user orders
    async getUserOrders() {
        try {
            const response = await api.get('/orders/my-orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }
    }
};
