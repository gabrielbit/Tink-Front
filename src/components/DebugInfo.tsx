import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { API_CONFIG, checkApiHealth } from '../config/constants';

export const DebugInfo: React.FC = () => {
  const theme = useTheme<Theme>();
  const [isVisible, setIsVisible] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');

  const checkApi = async () => {
    setApiStatus('checking');
    const isHealthy = await checkApiHealth();
    setApiStatus(isHealthy ? 'healthy' : 'unhealthy');
  };

  useEffect(() => {
    checkApi();
  }, []);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return theme.colors.success;
      case 'unhealthy': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'healthy': return '✅ Conectado';
      case 'unhealthy': return '❌ Desconectado';
      default: return '🔄 Verificando...';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.toggle, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={[styles.toggleText, { color: theme.colors.white }]}>
          {isVisible ? '🔧 Ocultar Debug' : '🔧 Debug'}
        </Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={[styles.debugPanel, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.debugTitle, { color: theme.colors.primary }]}>
            🔧 Información de Debug
          </Text>
          
          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: theme.colors.textPrimary }]}>
              Entorno:
            </Text>
            <Text style={[styles.debugValue, { color: theme.colors.textSecondary }]}>
              {typeof window !== 'undefined' ? 'Web' : 'Mobile'}
            </Text>
          </View>

          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: theme.colors.textPrimary }]}>
              URL Actual:
            </Text>
            <Text style={[styles.debugValue, { color: theme.colors.textSecondary }]}>
              {typeof window !== 'undefined' ? window.location.href : 'N/A'}
            </Text>
          </View>

          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: theme.colors.textPrimary }]}>
              Hostname:
            </Text>
            <Text style={[styles.debugValue, { color: theme.colors.textSecondary }]}>
              {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
            </Text>
          </View>

          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: theme.colors.textPrimary }]}>
              API URL:
            </Text>
            <Text style={[styles.debugValue, { color: theme.colors.textSecondary }]}>
              {API_CONFIG.BASE_URL}
            </Text>
          </View>

          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: theme.colors.textPrimary }]}>
              Estado API:
            </Text>
            <Text style={[styles.debugValue, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
            onPress={checkApi}
          >
            <Text style={[styles.testButtonText, { color: theme.colors.white }]}>
              🔄 Verificar API
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugPanel: {
    position: 'absolute',
    bottom: 45,
    right: 0,
    width: 300,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  debugRow: {
    marginBottom: 8,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  debugValue: {
    fontSize: 11,
    flexWrap: 'wrap',
  },
  testButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 