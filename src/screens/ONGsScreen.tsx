import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';

export const ONGsScreen = () => {
  const theme = useTheme<Theme>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <Text style={[styles.title, { color: theme.colors.purplePrimary }]}>
        ONGs
      </Text>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        Aquí se mostrarán las ONGs asociadas.
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
  text: {
    fontSize: 16,
  },
}); 