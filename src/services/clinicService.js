import axios from 'axios';

const API_URL = '/api/clinic/';

const clinicService = {
    queryClinic: async (serverCode) => {
        try {
            const response = await axios.get(API_URL + `query/${serverCode}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error consultando información de la clínica';
        }
    },

    createEnvironment: async (data) => {
        try {
            const response = await axios.post(API_URL + 'create-environment', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error creando entorno de clínica';
        }
    },

    createUsers: async (data) => {
        try {
            const response = await axios.post(API_URL + 'create-users', data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error creando usuarios adicionales';
        }
    },

    resetAdminPassword: async (serverName, newPassword) => {
        try {
            const response = await axios.post(API_URL + 'reset-admin-password', {
                serverName,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error reseteando contraseña de administrador';
        }
    }
};

export default clinicService;