import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email: string;
  name: string;
  profilePic?: string; // Opcional, puede no existir
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL base para las solicitudes de autenticación
const API_BASE_URL = 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de sesión al iniciar
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedRefreshToken && storedUser) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al cargar la sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string, newRefreshToken: string, newUser: User) => {
    try {
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
    } catch (error) {
      console.error('Error al guardar la sesión:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para refrescar el token de acceso usando el refresh token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      // Verificar si tenemos un refresh token
      if (!refreshToken) {
        console.error('No hay refresh token disponible');
        return false;
      }

      // Hacer la solicitud al servidor para refrescar el token
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('No se pudo refrescar el token');
      }

      const data = await response.json();
      
      // Guardar el nuevo token y refresh token
      if (data.accessToken) {
        await AsyncStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
      } else {
        console.error('No se recibió accessToken en la respuesta de refresh');
        return false;
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        setRefreshToken(data.refreshToken);
      }
      
      return true;
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      // Si hay un error al refrescar, limpiamos la sesión
      await logout();
      return false;
    }
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken,
      isLoading, 
      login, 
      logout,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 