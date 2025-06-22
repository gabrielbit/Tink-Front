import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { Props } from '../../navigation/types';
import { buildApiUrl, API_CONFIG } from '../../config/constants';

export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const theme = useTheme<Theme>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña');
      return;
    }

    try {
      setLoading(true);
      
      // Para desarrollo/pruebas: URL configurable según entorno
      // Puedes cambiar esto a tu URL real de la API
      // URL de login obtenida de la configuración centralizada
      const API_URL = buildApiUrl(API_CONFIG.AUTH.LOGIN);      

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Respuesta completa:', JSON.stringify(data));

      if (response.ok) {
        // Los campos cambiaron: accessToken en lugar de token
        console.log('Token recibido:', data.accessToken);
        console.log('Refresh token recibido:', data.refreshToken);
        
        // Verificamos la estructura de la respuesta
        if (!data.accessToken || !data.refreshToken) {
          console.error('No se recibieron los tokens necesarios:', data);
          Alert.alert('Error', 'No se recibieron los tokens de autenticación necesarios');
          return;
        }
        
        // Verificamos la estructura del objeto usuario
        if (!data.user || !data.user.id) {
          console.error('Invalid user data received:', data.user);
          Alert.alert('Error', 'Datos de usuario incompletos');
          return;
        }
        
        // Usar el hook useAuth para guardar los tokens y el usuario
        await login(data.accessToken, data.refreshToken, data.user);
        
        // No es necesario navegar manualmente, App.tsx se encargará de eso
        // cuando el estado de autenticación cambie
      } else {
        // Logging para depuración
        console.error('Error de login:', data);
        
        Alert.alert('Error', data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="marin.gabriel@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="test"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <Button 
        title={loading ? "Iniciando sesión..." : "Iniciar Sesión"} 
        onPress={handleLogin} 
        disabled={loading}
      />
      <Button 
        title="Crear Cuenta" 
        variant="secondary" 
        onPress={() => navigation.navigate('Register')} 
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
}); 