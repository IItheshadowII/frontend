import axios from 'axios';

const API_URL = '/api/settings';

const settingsService = {
    getSettings: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo configuración';
        }
    },

    saveSettings: async (settings) => {
        try {
            const response = await axios.post(API_URL, settings);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error guardando configuración';
        }
    }
};

export default settingsService;