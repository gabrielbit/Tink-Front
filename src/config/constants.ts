// Configuración centralizada de la aplicación
export const API_CONFIG = {
    // Cambia esta URL según tu entorno
    BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://18.116.204.51/api',
    
      // URLs específicas
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
    
    ENDPOINTS: {
      ORGANIZATIONS: '/organizations',
      PROJECTS: '/projects',
      CATEGORIES: '/categories',
    }
  };
  
  // Helper para construir URLs completas
  export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };
  
  export default API_CONFIG; 