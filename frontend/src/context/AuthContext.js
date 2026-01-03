import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api'; // ¡Esta línea es vital!

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('authToken');
            if (token) {
                try {
                    const result = await authAPI.verifyToken();
                    if (result.success && result.data?.user) {
                        setUser(result.data.user);
                        setIsAuthenticated(true);
                    } else {
                        Cookies.remove('authToken');
                    }
                } catch (error) {
                    Cookies.remove('authToken');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const result = await authAPI.login(credentials);
            if (result.success) {
                const data = result.data || {};
                if (data.token && data.user) {
                    Cookies.set('authToken', data.token, { expires: 1 });
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    setUser(data.user);
                    setIsAuthenticated(true);
                    return { success: true };
                }
            }
            return { success: false, error: result.message || 'Credenciales incorrectas' };
        } catch (error) {
            return { success: false, error: 'Error en el servidor' };
        }
    };

    const register = async (userData) => {
        const result = await authAPI.register(userData);
        return result.success ? { success: true } : { success: false, error: result.error };
    };

    const logout = () => {
        Cookies.remove('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = { user, loading, isAuthenticated, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;