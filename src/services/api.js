import axios from 'axios';

// Lee la variable de entorno REACT_APP_API_BASE_URL
// Por ejemplo, "http://localhost:7180" en desarrollo
// o "https://mi-dominio.com" en producción
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7180';

const api = axios.create({
  baseURL
});

export default api;
