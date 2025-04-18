import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = () => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <Text style={[styles.title, { color: theme.colors.purplePrimary }]}>
        Inicio
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textPrimary }]}>
        ¡Bienvenido, {user?.name || 'Usuario'}!
      </Text>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        Esta es la pantalla de inicio de Tink.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
  },
}); 