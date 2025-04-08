import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEnvironment from './pages/CreateEnvironment';
import Queries from './pages/Queries';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
// Elimina esta importación si no la estás usando
// import RequireAuth from './components/RequireAuth';

// Create a theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
});

const App = () => {
    // Usa basename en caso de que la aplicación no esté en la raíz del servidor
    const basename = document.querySelector('base')?.getAttribute('href') || '';

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router basename={basename}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            } />
                            <Route path="/create-environment" element={
                                <Layout>
                                    <CreateEnvironment />
                                </Layout>
                            } />
                            <Route path="/queries" element={
                                <Layout>
                                    <Queries />
                                </Layout>
                            } />
                            <Route path="/settings" element={
                                <Layout>
                                    <Settings />
                                </Layout>
                            } />
                        </Route>

                        {/* 404 Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;