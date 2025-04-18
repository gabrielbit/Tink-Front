import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { Props } from '../../navigation/types';

export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const theme = useTheme<Theme>();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Usar el hook useAuth para guardar el token y el usuario
        await login(data.token, data.user);
        
        // No es necesario navegar manualmente, App.tsx se encargará de eso
        // cuando el estado de autenticación cambie
      } else {
        Alert.alert('Error', data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button 
        title="Crear Cuenta" 
        variant="secondary" 
        onPress={() => navigation.navigate('Register')} 
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