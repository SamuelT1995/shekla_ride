import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (loginIdentifier, password) => {
        const res = await api.post('/auth/login', { loginIdentifier, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, authenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
