import React from 'react';
import { useAuth } from '../context/AuthContext';


const RequireAuth = ({ children }) => {
    const { isAuthenticated, initialized, loading } = useAuth();

    if (loading || !initialized) {
        return <div>Cargando autenticación...</div>;
    }

    if (!isAuthenticated) {
        return <div>No estás autenticado. Acceso denegado.</div>;
    }

    return children;
};

export default RequireAuth;
