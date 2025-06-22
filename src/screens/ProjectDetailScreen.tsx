import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image, Linking } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Project, ProjectImage } from '../services/api';
import { apiClient } from '../services/api';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../navigation/ProjectsStackNavigator';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, API_CONFIG } from '../config/constants';

// Imagen de ejemplo para proyectos que no tienen imagen
const fallbackImage = { uri: 'https://as1.ftcdn.net/v2/jpg/13/26/83/50/1000_F_1326835055_xWwsKmGQesgjMyKJeczSBFmWWqPhPaXF.jpg' };

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
  
  // Valores ficticios para demostración
  const raisedAmount = 24205;
  const goalAmount = 250000;
  const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usar solo el ID del proyecto para la API, ignorando el slug
        const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${projectId}`;
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
            'Tu sesión ha expirada o no tienes permisos para acceder a esta información. Por favor, inicia sesión nuevamente.',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGoBack = () => {
    // Navegar explícitamente a la lista de proyectos en lugar de usar goBack()
    navigation.navigate('ProjectsList');
  };
  
  const handleShare = () => {
    // Implementación futura para compartir
    console.log('Compartiendo proyecto:', project?.title);
    Alert.alert('Compartir', 'Función de compartir será implementada pronto');
  };
  
  const handleDonate = () => {
    // Implementación futura para donar
    console.log('Donando al proyecto:', project?.title);
    Alert.alert('Donar', 'Función de donar será implementada pronto');
  };
  
  const openWebsite = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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

  // Obtener la URL de la imagen del proyecto
  let imageUrl = fallbackImage.uri;
  
  // Tener en cuenta la estructura vista en la captura
  if (project.images && project.images.length > 0) {
    const mainImage = project.images.find(img => img.is_main === true);
    if (mainImage && mainImage.path) {
      imageUrl = mainImage.path;
    } else if (project.images[0].path) {
      imageUrl = project.images[0].path;
    }
  }

  // Obtener la URL de la imagen de la organización
  let orgImageUrl = '';
  if (project.organization) {
    if (project.organization.images && project.organization.images.length > 0) {
      const orgMainImage = project.organization.images.find(img => img.is_main === true);
      if (orgMainImage && orgMainImage.path) {
        orgImageUrl = orgMainImage.path;
      } else if (project.organization.images[0].path) {
        orgImageUrl = project.organization.images[0].path;
      }
    } else if (project.organization.mainImage) {
      orgImageUrl = project.organization.mainImage;
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      {/* Imagen principal */}
      <Image 
        source={{ uri: imageUrl }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: theme.colors.white }]}
        onPress={handleGoBack}
      >
        <Text style={{ color: theme.colors.primary }}>← Volver</Text>
      </TouchableOpacity>
      
      {/* Tarjeta principal de información */}
      <View style={styles.mainInfoContainer}>
        <View style={styles.logoAndTitleContainer}>
          {orgImageUrl ? (
            <Image 
              source={{ uri: orgImageUrl }}
              style={styles.organizationLogo}
            />
          ) : null}
          
          <View style={styles.titleContainer}>
            <Text style={[styles.organizationName, { color: theme.colors.primary }]}>
              {project.organization?.name || 'Organización'}
            </Text>
            <Text style={[styles.projectTitle, { color: theme.colors.textPrimary }]}>
              {project.title}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
          {project.city}, {project.country}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textPrimary }]}>
          {project.description}
        </Text>
      </View>
      
      {/* Tarjeta de financiamiento */}
      <View style={styles.fundingCard}>
        <View style={styles.fundingRow}>
          <View>
            <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Recaudado</Text>
            <Text style={[styles.amount, { color: theme.colors.textPrimary }]}>{formatCurrency(raisedAmount)}</Text>
          </View>
          <View style={styles.goalContainer}>
            <Text style={[styles.amountLabel, { color: theme.colors.textSecondary, textAlign: 'right' }]}>Meta</Text>
            <Text style={[styles.amount, { color: theme.colors.textPrimary }]}>{formatCurrency(goalAmount)}</Text>
          </View>
        </View>
        
        {/* Barra de progreso */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { 
                width: `${progressPercentage}%`,
                backgroundColor: theme.colors.primary
              }]} 
            />
          </View>
        </View>
        
        {/* Botones de acción */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.shareButton, { borderColor: theme.colors.primary }]}
            onPress={handleShare}
          >
            <Text style={[styles.shareButtonText, { color: theme.colors.primary }]}>Compartir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.donateButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleDonate}
          >
            <Text style={[styles.donateButtonText, { color: theme.colors.white }]}>Donar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Detalles adicionales */}
      <View style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Detalles del Proyecto
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Fecha de inicio:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{formatDate(project.startDate)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Fecha de finalización:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{formatDate(project.endDate)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Monto máximo:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>${project.maxAmount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Impacto esperado:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{project.expectedImpact}</Text>
        </View>
      </View>
      
      {/* Categorías */}
      {project.categories && project.categories.length > 0 && (
        <View style={styles.categoriesCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Categorías
          </Text>
          
          <View style={styles.categoriesContainer}>
            {project.categories.map(category => {
              // Usar el color de la categoría desde la API o un color por defecto
              const categoryColor = category.color || theme.colors.primary;
              
              return (
                <View 
                  key={category.id} 
                  style={[
                    styles.categoryTag, 
                    { 
                      backgroundColor: theme.colors.white,
                      borderColor: categoryColor,
                      borderWidth:  1
                    }
                  ]}
                >
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {category.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 280,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  mainInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizationLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  organizationName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  fundingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fundingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalContainer: {
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    marginVertical: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  donateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  categoriesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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