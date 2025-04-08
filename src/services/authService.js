import axios from 'axios';

const API_URL = '/api/auth/';

const authService = {
    login: async (username, password, rememberMe = false) => {
        try {
            const response = await axios.post(API_URL + 'login', {
                username,
                password,
                rememberMe
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    username: response.data.username,
                    fullName: response.data.fullName,
                    groups: response.data.groups,
                    roles: response.data.roles
                }));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Error en el proceso de login';
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    hasPermission: (permission) => {
        const user = authService.getCurrentUser();
        if (!user || !user.roles) return false;

        // Administrador tiene todos los permisos
        if (user.roles.includes('Administrator')) return true;

        // Mapeo simple de roles a permisos
        const rolePermissions = {
            'UserManager': ['CreateUsers', 'ModifyUsers', 'UnlockUsers', 'DisableUsers', 'EnableUsers', 'ResetPasswords', 'ViewUserDetails'],
            'ClinicCreator': ['CreateClinicEnvironment', 'ViewDashboard'],
            'Viewer': ['ViewDashboard', 'ViewUserDetails'],
            'BasicUser': ['ViewBasicInfo']
        };

        // Verificar si alguno de los roles del usuario tiene el permiso requerido
        for (const role of user.roles) {
            if (rolePermissions[role]?.includes(permission)) {
                return true;
            }
        }

        return false;
    },

    validateToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await axios.get(API_URL + 'validate', {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.valid;
        } catch (error) {
            authService.logout();
            return false;
        }
    }
};

// Agregar interceptor para adjuntar el token a todas las solicitudes
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto logout si recibimos un 401 (Unauthorized)
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default authService;