import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/theme';
import { Props } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { buildApiUrl, API_CONFIG } from '../../config/constants';

export const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme<Theme>();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Registrar al usuario
      const registerResponse = await fetch(buildApiUrl(API_CONFIG.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        Alert.alert('Error', registerData.message || 'Error al crear la cuenta');
        setLoading(false);
        return;
      }
      
      // 2. Iniciar sesión automáticamente
      const loginResponse = await fetch(buildApiUrl(API_CONFIG.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const loginData = await loginResponse.json();
      console.log('Respuesta completa de login:', JSON.stringify(loginData));
      
      if (loginResponse.ok) {
        // Verificar que se recibieron los tokens necesarios
        if (!loginData.accessToken || !loginData.refreshToken) {
          console.error('No se recibieron los tokens necesarios:', loginData);
          Alert.alert(
            'Cuenta creada', 
            'Tu cuenta se ha creado exitosamente, pero hubo un problema al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
          return;
        }
        
        // 3. Guardar el token y redirigir al home
        await login(loginData.accessToken, loginData.refreshToken, loginData.user);
        
        // No es necesario navegar manualmente, App.tsx se encargará de mostrar
        // la pantalla Home basado en el estado de autenticación
      } else {
        // Si falla el inicio de sesión, pero el registro fue exitoso
        Alert.alert(
          'Cuenta creada', 
          'Tu cuenta se ha creado exitosamente, pero hubo un problema al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />
      <Button 
        title={loading ? "Procesando..." : "Registrarse"} 
        onPress={handleRegister} 
        disabled={loading}
      />
      <Button 
        title="Volver a Login" 
        variant="secondary" 
        onPress={() => navigation.navigate('Login')} 
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