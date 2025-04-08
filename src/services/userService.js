import axios from 'axios';

const API_URL = '/api/user/';

const userService = {
    getUserInfo: async (username) => {
        try {
            const response = await axios.post(API_URL + 'query', { username });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo información del usuario';
        }
    },

    enableUser: async (username) => {
        try {
            const response = await axios.post(API_URL + 'enable', { username });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error habilitando usuario';
        }
    },

    disableUser: async (username) => {
        try {
            const response = await axios.post(API_URL + 'disable', { username });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error deshabilitando usuario';
        }
    },

    unlockUser: async (username) => {
        try {
            const response = await axios.post(API_URL + 'unlock', { username });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error desbloqueando usuario';
        }
    },

    resetPassword: async (username, newPassword) => {
        try {
            const response = await axios.post(API_URL + 'reset-password', {
                username,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error reseteando contraseña';
        }
    },

    getCurrentUserInfo: async () => {
        try {
            const response = await axios.get(API_URL + 'current');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error obteniendo información del usuario actual';
        }
    }
};

export default userService;