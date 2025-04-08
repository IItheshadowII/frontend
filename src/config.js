// Si está en producción (IIS), usa path relativo, de lo contrario usa la URL completa
const isProduction = process.env.NODE_ENV === 'production';
export const API_URL = isProduction ? '' : 'http://127.0.0.1:7180';