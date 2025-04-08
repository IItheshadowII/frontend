import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verificar el estado de autenticación al iniciar la app
    useEffect(() => {
        const fetchAuthStatus = async () => {
            setLoading(true);
            try {
                // Se consulta el endpoint actual para ver si ya existe sesión
                const response = await axios.get(`${API_URL}/api/user/current`, {
                    withCredentials: true
                });
                if (response.data && response.data.username) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error('Error al verificar el estado de autenticación:', err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        fetchAuthStatus();
    }, []);

    // Función para realizar el login contra el endpoint de AD
    const login = async (username, password, rememberMe) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                { username, password, rememberMe },
                { withCredentials: true }
            );
            if (response.data && response.data.token) {
                // Se guarda la información del usuario (puedes incluir aquí el token)
                setUser(response.data);
                setIsAuthenticated(true);
                return true;
            } else {
                setError("Respuesta no válida del servidor.");
                setIsAuthenticated(false);
                return false;
            }
        } catch (err) {
            console.error("Error durante el login:", err);
            setError(err.response?.data?.message || "Error en el login");
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función de logout (puedes ampliar esta función para llamar a un endpoint de cierre de sesión si lo requieres)
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        initialized,
        error,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
