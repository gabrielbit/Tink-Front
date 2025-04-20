import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Project } from '../services/api';
import { apiClient } from '../services/api';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../navigation/ProjectsStackNavigator';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

type ProjectDetailScreenRouteProp = RouteProp<ProjectsStackParamList, 'ProjectDetail'>;
type ProjectDetailScreenNavigationProp = NativeStackNavigationProp<ProjectsStackParamList>;

type Props = {
  route: ProjectDetailScreenRouteProp;
  navigation: ProjectDetailScreenNavigationProp;
};

export const ProjectDetailScreen = ({ route, navigation }: Props) => {
  const { projectId } = route.params;
  const theme = useTheme<Theme>();
  const { logout } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `http://localhost:3000/api/projects/${projectId}`;
        console.log('Obteniendo detalles del proyecto:', url);
        const response = await apiClient.fetchWithAuth(url);
        const data = await response.json();
        console.log('Datos del proyecto recibidos:', data);
        setProject(data);
      } catch (err: any) {
        console.error('Error loading project details:', err);
        
        // Verificar si es un error de autenticación
        if (err.message && (
          err.message.includes('token') || 
          err.message.includes('sesión') || 
          err.message.includes('autenticación')
        )) {
          Alert.alert(
            'Sesión expirada',
            'Tu sesión ha expirado o no tienes permisos para acceder a esta información. Por favor, inicia sesión nuevamente.',
            [
              { 
                text: 'OK', 
                onPress: async () => {
                  // Cerrar sesión y volver a la pantalla de login
                  await logout();
                } 
              }
            ]
          );
        } else {
          setError('No se pudo cargar la información del proyecto. Intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const renderInfoRow = (label: string, value: string | undefined | null) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.colors.textPrimary }]}>{label}:</Text>
      <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
        {value || 'No disponible'}
      </Text>
    </View>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.purplePrimary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Cargando detalles del proyecto...
        </Text>
      </View>
    );
  }

  if (error || !project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error || 'No se encontró el proyecto solicitado'}
        </Text>
        <Button 
          title="Volver" 
          onPress={handleGoBack}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.white }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.purpleLight }]}
          onPress={handleGoBack}
        >
          <Text style={{ color: theme.colors.purplePrimary }}>← Volver</Text>
        </TouchableOpacity>
        
        {project.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: theme.colors.purpleLight }]}>
            <Text style={[styles.featuredText, { color: theme.colors.purplePrimary }]}>Destacado</Text>
          </View>
        )}
        
        <Text style={[styles.title, { color: theme.colors.purplePrimary }]}>
          {project.title}
        </Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.purplePrimary }]}>
          Información General
        </Text>
        
        <View style={styles.infoContainer}>
          {renderInfoRow('Descripción', project.description)}
          {renderInfoRow('País', project.country)}
          {renderInfoRow('Ciudad', project.city)}
          {renderInfoRow('Fecha de inicio', formatDate(project.startDate))}
          {renderInfoRow('Fecha de finalización', formatDate(project.endDate))}
          {renderInfoRow('Monto máximo', `$${project.maxAmount}`)}
          {renderInfoRow('Impacto esperado', project.expectedImpact)}
          {renderInfoRow('Fecha de creación', formatDate(project.createdAt))}
          {renderInfoRow('Última actualización', formatDate(project.updatedAt))}
        </View>
      </View>
      
      {project.organization && (
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.purplePrimary }]}>
            Organización
          </Text>
          
          <View style={styles.infoContainer}>
            {renderInfoRow('Nombre', project.organization.name)}
            {renderInfoRow('Descripción', project.organization.description)}
            {renderInfoRow('Responsable', project.organization.responsibleName)}
            {renderInfoRow('Email', project.organization.responsibleEmail)}
            {renderInfoRow('Teléfono', project.organization.responsiblePhone)}
          </View>
        </View>
      )}
      
      {project.categories && project.categories.length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.purplePrimary }]}>
            Categorías
          </Text>
          
          <View style={styles.categoriesContainer}>
            {project.categories.map(category => (
              <View 
                key={category.id} 
                style={[styles.categoryTag, { backgroundColor: theme.colors.purpleLight }]}
              >
                <Text style={[styles.categoryText, { color: theme.colors.purplePrimary }]}>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.contactButton, { backgroundColor: theme.colors.purplePrimary }]}
      >
        <Text style={[styles.contactButtonText, { color: theme.colors.white }]}>
          Contactar para participar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  featuredBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  section: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactButton: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
}); 