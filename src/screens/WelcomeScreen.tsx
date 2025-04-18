import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Props } from '../navigation/types';
import { Button } from '../components/Button';

export const WelcomeScreen = ({ navigation }: Props) => {
  const { user, logout } = useAuth();
  const theme = useTheme<Theme>();

  const handleLogout = async () => {
    await logout();
    // No es necesario navegar manualmente ya que
    // el Navigation en App.tsx se encargará de eso basado en el estado del usuario
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <Text style={[styles.welcomeText, { color: theme.colors.purplePrimary }]}>
        ¡Bienvenido, {user?.name || 'Usuario'}!
      </Text>
      <Text style={[styles.emailText, { color: theme.colors.black }]}>
        {user?.email || 'correo@ejemplo.com'}
      </Text>
      <Button 
        title="Cerrar Sesión"
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
  },
}); 