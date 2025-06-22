// Configuración centralizada de la aplicación

// Función para detectar el entorno correctamente
const isProduction = () => {
  // En web
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('192.168.');
  }
  
  // En React Native
  return !__DEV__;
};

// URLs de configuración
const DEVELOPMENT_API_URL = 'http://localhost:3000/api';
const PRODUCTION_API_URL = 'https://18.116.204.51/api';

// Detectar entorno actual
const IS_PRODUCTION = isProduction();
const CURRENT_API_URL = IS_PRODUCTION ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;

// Debugging info
console.log('🔧 Environment Debug Info:');
console.log('- IS_PRODUCTION:', IS_PRODUCTION);
console.log('- CURRENT_API_URL:', CURRENT_API_URL);
if (typeof window !== 'undefined') {
  console.log('- window.location.hostname:', window.location.hostname);
  console.log('- window.location.href:', window.location.href);
}
console.log('- __DEV__:', typeof __DEV__ !== 'undefined' ? __DEV__ : 'undefined');

export const API_CONFIG = {
  // URL que cambia según el entorno
  BASE_URL: CURRENT_API_URL,
    
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

// Helper para verificar si el API está funcionando
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificando estado del API...');
    console.log('- URL a verificar:', API_CONFIG.BASE_URL);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
    });
    
    const isHealthy = response.ok;
    console.log('- Estado del API:', isHealthy ? '✅ OK' : '❌ ERROR');
    console.log('- Status code:', response.status);
    
    return isHealthy;
  } catch (error) {
    console.log('❌ Error al verificar el API:', error);
    console.log('- Posibles causas:');
    console.log('  1. El servidor backend no está corriendo');
    console.log('  2. Problema de CORS');
    console.log('  3. URL incorrecta');
    console.log('  4. Firewall bloqueando la conexión');
    return false;
  }
};

export default API_CONFIG; 
