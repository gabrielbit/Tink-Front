// Tipos para la API de organizaciones
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG, buildApiUrl } from '../config/constants';

export interface Organization {
  id: string;
  name: string;
  description: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  maxAmount: number;
  expectedImpact: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  categories?: Category[];
}

export interface ApiResponse {
  organizations: Organization[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface OrganizationParams {
  name?: string;
  responsibleName?: string;
  responsibleEmail?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  page?: number;
}

export interface ProjectParams {
  title?: string;
  country?: string;
  city?: string;
  featured?: boolean;
  categoryId?: string;
  organizationId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  page?: number;
}

const API_BASE_URL = API_CONFIG.BASE_URL;

// Cliente API con manejo de tokens
export const apiClient = {
  // Función para hacer solicitudes autenticadas con manejo de refresh token
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    // Intentar obtener el token actual (ahora se almacena como accessToken)
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
    }
    
    // Configurar headers con token de autorización
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Realizar la solicitud
    let response = await fetch(url, authOptions);
    
    // Si la respuesta es 401 (No autorizado), intentar refrescar el token
    if (response.status === 401) {
      // No podemos usar el hook useAuth directamente aquí (fuera de un componente React)
      // Así que implementamos la lógica de refresh manualmente
      const refreshResult = await this.refreshToken();
      
      // Si no se pudo refrescar el token, propagar el error de autenticación
      if (!refreshResult) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      // Obtener el nuevo token
      const newToken = await AsyncStorage.getItem('token');
      
      // Actualizar el header de autorización y reintentar la solicitud
      authOptions.headers = {
        ...authOptions.headers,
        'Authorization': `Bearer ${newToken}`
      };
      
      response = await fetch(url, authOptions);
    }
    
    // Si la respuesta sigue sin ser ok, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
    }
    
    return response;
  },
  
  // Función para refrescar el token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return false;
      }
      
      const response = await fetch(buildApiUrl(API_CONFIG.AUTH.REFRESH_TOKEN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        // Si falla el refresh, limpiar la sesión
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
        return false;
      }
      
      const data = await response.json();
      
      // Guardar el nuevo token y, si viene, el nuevo refresh token
      // Ajustamos los nombres de los campos según la respuesta del backend
      if (data.accessToken) {
        await AsyncStorage.setItem('token', data.accessToken);
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return true;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      return false;
    }
  }
};

export const fetchOrganizations = async (params: OrganizationParams = {}): Promise<ApiResponse> => {
  try {
    // Construir la URL con los parámetros de consulta
    const queryParams = new URLSearchParams();
    
    // Añadir parámetros si existen
    if (params.name) queryParams.append('name', params.name);
    if (params.responsibleName) queryParams.append('responsibleName', params.responsibleName);
    if (params.responsibleEmail) queryParams.append('responsibleEmail', params.responsibleEmail);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    // Crear la URL completa
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/organizations${queryString ? `?${queryString}` : ''}`;
    
    // Usar el cliente API con manejo de refresh token
    const response = await apiClient.fetchWithAuth(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchOrganizations:', error);
    // Retornar datos vacíos en caso de error
    return {
      organizations: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
      }
    };
  }
}; 