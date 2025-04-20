/**
 * API mock para pruebas de autenticación
 * Este archivo simula el comportamiento de un servidor real para pruebas locales
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes para la simulación
const ACCESS_TOKEN_EXPIRY = 2 * 60 * 1000; // 2 minutos en milisegundos
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

// Datos de usuario de prueba
const MOCK_USERS = [
  {
    id: 'user-001',
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    password: 'password123', // En un sistema real nunca almacenes contraseñas en texto plano
    profilePic: null
  }
];

// Mock de ONGs para pruebas
const MOCK_ORGANIZATIONS = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Fundación Ejemplo',
    description: 'Una organización de ejemplo',
    responsibleName: 'Juan Pérez',
    responsibleEmail: 'juan@ejemplo.com',
    responsiblePhone: '123456789',
    instagramUrl: 'instagram.com/fundacion_ejemplo',
    facebookUrl: 'facebook.com/fundacion_ejemplo',
    websiteUrl: 'fundacionejemplo.org',
    createdAt: '2023-01-01T12:00:00.000Z',
    updatedAt: '2023-01-01T12:00:00.000Z'
  }
];

// Función para generar tokens JWT simulados
const generateMockJWT = (userId: string, expiry: number): string => {
  // En un sistema real, esto sería un token JWT real
  const expiryTimestamp = Date.now() + expiry;
  return `mock-jwt-${userId}-${expiryTimestamp}`;
};

// API de autenticación
export const mockAuthAPI = {
  // Iniciar sesión
  async login(email: string, password: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { 
        ok: false, 
        status: 401,
        json: async () => ({ message: 'Credenciales incorrectas' })
      };
    }
    
    const token = generateMockJWT(user.id, ACCESS_TOKEN_EXPIRY);
    const refreshToken = generateMockJWT(user.id, REFRESH_TOKEN_EXPIRY);
    
    // Guardar el refresh token para validaciones posteriores
    await AsyncStorage.setItem('mockRefreshTokens', JSON.stringify({
      [refreshToken]: {
        userId: user.id,
        expiresAt: Date.now() + REFRESH_TOKEN_EXPIRY
      }
    }));
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic
        }
      })
    };
  },
  
  // Registrar nuevo usuario
  async register(name: string, email: string, password: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS.some(u => u.email === email)) {
      return {
        ok: false,
        status: 400,
        json: async () => ({ message: 'El email ya está registrado' })
      };
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      profilePic: null
    };
    
    // Añadir usuario al array (en memoria, se perderá al recargar)
    MOCK_USERS.push(newUser);
    
    return {
      ok: true,
      status: 201,
      json: async () => ({ message: 'Usuario registrado exitosamente' })
    };
  },
  
  // Refrescar token
  async refreshToken(refreshToken: string) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtener tokens almacenados
    const tokensData = await AsyncStorage.getItem('mockRefreshTokens');
    const tokens = tokensData ? JSON.parse(tokensData) : {};
    
    // Verificar si el token existe y es válido
    if (!tokens[refreshToken] || tokens[refreshToken].expiresAt < Date.now()) {
      return {
        ok: false,
        status: 401,
        json: async () => ({ message: 'Refresh token inválido o expirado' })
      };
    }
    
    const userId = tokens[refreshToken].userId;
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      return {
        ok: false,
        status: 404,
        json: async () => ({ message: 'Usuario no encontrado' })
      };
    }
    
    // Generar nuevo access token
    const newToken = generateMockJWT(userId, ACCESS_TOKEN_EXPIRY);
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        token: newToken,
        // Opcionalmente, también se puede renovar el refresh token
        refreshToken: refreshToken
      })
    };
  }
};

// API de organizaciones
export const mockOrganizationsAPI = {
  async getOrganizations(params: any = {}) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Verificar que hay un token válido (simulación simple)
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return {
        ok: false,
        status: 401,
        json: async () => ({ message: 'No autorizado' })
      };
    }
    
    // Filtrar organizaciones (simulación simple)
    let filteredOrgs = [...MOCK_ORGANIZATIONS];
    
    if (params.name) {
      filteredOrgs = filteredOrgs.filter(org => 
        org.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }
    
    if (params.responsibleName) {
      filteredOrgs = filteredOrgs.filter(org => 
        org.responsibleName.toLowerCase().includes(params.responsibleName.toLowerCase())
      );
    }
    
    // Paginación simple
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrgs = filteredOrgs.slice(startIndex, endIndex);
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        organizations: paginatedOrgs,
        pagination: {
          total: filteredOrgs.length,
          totalPages: Math.ceil(filteredOrgs.length / limit),
          currentPage: page,
          limit
        }
      })
    };
  }
}; 