import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
      {project.featured && (
        <View style={[styles.featuredBadge, { backgroundColor: theme.colors.purpleLight }]}>
          <Text style={[styles.featuredText, { color: theme.colors.purplePrimary }]}>Destacado</Text>
        </View>
      )}
      
      <Text style={[styles.title, { color: theme.colors.purplePrimary }]}>{project.title}</Text>
      <Text style={[styles.description, { color: theme.colors.textPrimary }]}>{project.description}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textPrimary }]}>Ubicación:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
            {project.city}, {project.country}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textPrimary }]}>Fechas:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.colors.textPrimary }]}>Monto máximo:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
            ${project.maxAmount}
          </Text>
        </View>
        
        {project.organization && (
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.colors.textPrimary }]}>Organización:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.purplePrimary }]}>
              {project.organization.name}
            </Text>
          </View>
        )}
      </View>
      
      {project.categories && project.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={[styles.categoriesLabel, { color: theme.colors.textPrimary }]}>Categorías:</Text>
          <View style={styles.categoriesList}>
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
        style={[styles.button, { backgroundColor: theme.colors.purplePrimary }]}
        onPress={handleViewDetails}
      >
        <Text style={[styles.buttonText, { color: theme.colors.white }]}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  }
}); 