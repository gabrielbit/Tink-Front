import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Project } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../navigation/ProjectsStackNavigator';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<ProjectsStackParamList>>();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  // Función para generar un slug si no existe
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/--+/g, '-'); // Remover guiones duplicados
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(project);
    } else {
      // Simplificar la navegación - usar solo el ID
      try {
        navigation.navigate('ProjectDetail', { 
          projectId: project.id
        });
      } catch (error) {
        console.error('Error al navegar:', error);
      }
    }
  };

  // Placeholder para imagen si no hay una disponible
  const fallbackImage = { uri: 'https://as1.ftcdn.net/v2/jpg/13/26/83/50/1000_F_1326835055_xWwsKmGQesgjMyKJeczSBFmWWqPhPaXF.jpg' };
  
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

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.white }]}
      onPress={handleViewDetails}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {project.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>Destacado</Text>
          </View>
        )}
        
        <View style={[styles.locationBadge, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.badgeText, { color: theme.colors.textPrimary }]}>
            {project.city}, {project.country}
          </Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{project.title}</Text>
        
        <Text 
          style={[styles.description, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {project.description}
        </Text>
        
        <View style={styles.metaInfo}>
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            Fechas: {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </Text>
          
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            Monto máximo: ${project.maxAmount}
          </Text>
          
          {project.organization && (
            <Text style={[styles.organizationText, { color: theme.colors.primary }]}>
              {project.organization.name}
            </Text>
          )}
        </View>
        
        {project.categories && project.categories.length > 0 && (
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
                      borderWidth: 1
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
        )}
        
        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.colors.primary,
                  width: `${Math.min(Math.random() * 100, 100)}%`
                }
              ]} 
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleViewDetails}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaInfo: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    marginBottom: 4,
  },
  organizationText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  }
}); 