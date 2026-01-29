import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const getCurrentUser = () => {
    // In a real app, you might decode the token or fetch /me
    // For now, we rely on the state provided by the login/register response
    return JSON.parse(localStorage.getItem('user'));
};
