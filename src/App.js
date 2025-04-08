import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CloudQuery from './components/CloudQuery';
import UserQuery from './components/UserQuery';
import Settings from './components/Settings';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
import PrivateRoute from './components/PrivateRoute';

// Servicios
import authService from './services/authService';

function App() {
    const [loading, setLoading] = useState(true);

    // Verificar token al inicio
    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (authService.isAuthenticated()) {
                    await authService.validateToken();
                }
            } catch (error) {
                console.error('Error al validar token:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Iniciando aplicación...</p>
            </div>
        );
    }

    return (
        <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />

            {/* Ruta de acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rutas protegidas */}
            <Route path="/" element={
                <PrivateRoute>
                    <Layout />
                </PrivateRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="cloud-query" element={<CloudQuery />} />
                <Route path="user-query" element={<UserQuery />} />
                <Route path="settings" element={
                    <PrivateRoute requiredPermission="ModifySettings">
                        <Settings />
                    </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;