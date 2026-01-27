import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    // In a simpler flow, we just trust the token exists. 
                    // Ideally we would fetch the user profile from the backend here.
                    // For now, we'll extract minimal info or rely on stored user data if any.
                    // Let's just set a basic user object from the token claims + any generic "User" placeholder
                    setUser({
                        id: decoded.id,
                        email: decoded.email,
                        plan: decoded.plan || 'free',
                        // name/username might not be in token depending on backend implementation
                        // We will fetch real profile later or store it in localStorage on login
                        username: localStorage.getItem('username') || 'Member'
                    });
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            setUser(data.user);
            localStorage.setItem('username', data.user.username); // Store simpler details for persistence
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const data = await apiRegister(username, email, password);
            setUser(data.user);
            localStorage.setItem('username', data.user.username);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiLogout();
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
