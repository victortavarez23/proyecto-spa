import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    // Si existe una variable de entorno, úsala. Si no, usa localhost (para desarrollo).
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data; 
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error de conexión'
            };
        }
    },
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error en registro'
            };
        }
    },
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default api;