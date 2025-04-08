import axios from 'axios';

const API_URL = '/api/dashboard/';

const dashboardService = {
    getSummary: async () => {
        try {
            const response = await axios.get(API_URL + 'summary');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo resumen del dashboard';
        }
    },

    getAlerts: async () => {
        try {
            const response = await axios.get(API_URL + 'alerts');
            return response.data.alerts;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo alertas';
        }
    },

    getUsersCreatedStats: async () => {
        try {
            const response = await axios.get(API_URL + 'users-created-stats');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo estadísticas de creación de usuarios';
        }
    },

    getCredentialAgeStats: async () => {
        try {
            const response = await axios.get(API_URL + 'credential-age-stats');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo estadísticas de antigüedad de credenciales';
        }
    }
};

export default dashboardService;