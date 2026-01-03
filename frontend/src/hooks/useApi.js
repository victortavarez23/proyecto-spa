import { useState, useCallback } from 'react';
// IMPORTANTE: Este archivo lo crearemos en el siguiente paso, no te preocupes si da error ahora.
import { apiRequest } from '../services/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (apiCall, onSuccess = null, onError = null) => {
        setLoading(true);
        setError(null);

        const result = await apiRequest(apiCall);

        if (result.success) {
            setData(result.data);
            if (onSuccess) onSuccess(result.data);
        } else {
            setError(result.error);
            if (onError) onError(result.error);
        }

        setLoading(false);
        return result;
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        execute,
        loading,
        error,
        data,
        reset
    };
};

// Hook específico para operaciones CRUD (Create, Update, Delete)
// Simplifica la lógica cuando no necesitamos guardar la data en el estado local del hook
export const useApiOperation = (apiFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);

        // Envolvemos la llamada para que apiRequest la maneje
        const result = await apiRequest(() => apiFunction(...args));

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
        return result;
    }, [apiFunction]);

    return { execute, loading, error };
};