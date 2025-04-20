import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl, Alert } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Project, ProjectParams } from '../services/api';
import { apiClient } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilter } from '../components/ProjectFilter';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../navigation/ProjectsStackNavigator';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>;

export const ProjectsScreen = ({ navigation }: Props) => {
  const theme = useTheme<Theme>();
  const { logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterParams, setFilterParams] = useState<ProjectParams>({});
  const pageSize = 10;

  // Función local para cargar proyectos
  const fetchProjects = async (params: ProjectParams = {}) => {
    try {
      // Construir la URL con los parámetros de consulta
      const queryParams = new URLSearchParams();
      
      // Añadir parámetros si existen
      if (params.title) queryParams.append('title', params.title);
      if (params.country) queryParams.append('country', params.country);
      if (params.city) queryParams.append('city', params.city);
      if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.organizationId) queryParams.append('organizationId', params.organizationId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      
      // Crear la URL completa
      const queryString = queryParams.toString();
      const url = `http://localhost:3000/api/projects${queryString ? `?${queryString}` : ''}`;
      
      // Usar el cliente API con manejo de refresh token
      const response = await apiClient.fetchWithAuth(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en fetchProjects:', error);
      // Retornar datos vacíos en caso de error
      return {
        projects: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10
        }
      };
    }
  };

  const loadProjects = async (page: number, params: ProjectParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: ProjectParams = {
        ...params,
        page,
        limit: pageSize,
      };
      
      const response = await fetchProjects(queryParams);
      
      setProjects(response.projects);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.total);
        setCurrentPage(response.pagination.currentPage);
      }
    } catch (err: any) {
      console.error('Error loading projects:', err);
      
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
        setError('No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects(1, filterParams);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProjects(1, filterParams);
  };

  const handleFilterChange = (params: ProjectParams) => {
    setFilterParams(params);
    loadProjects(1, params);
  };

  const handlePageChange = (page: number) => {
    loadProjects(page, filterParams);
  };

  const handleViewProjectDetails = (project: Project) => {
    // Navegar a la pantalla de detalles solo con el ID del proyecto
    // El slug se usará solo para URLs amigables, pero no es necesario para la navegación interna
    navigation.navigate('ProjectDetail', { 
      projectId: project.id
    });
    console.log('Navegando a ProjectDetail con ID:', project.id);
  };

  // Función para generar un slug si no existe
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/--+/g, '-'); // Remover guiones duplicados
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <ProjectFilter onFilter={handleFilterChange} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Proyectos
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {totalItems} {totalItems === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => {
    // Si hay filtros activos, mostramos un mensaje específico
    const hasActiveFilters = filterParams.title || filterParams.country || filterParams.city;
    
    return (
      <View style={styles.emptyContainer}>
        {/* Icono o ilustración */}
        <View style={styles.emptyIconContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={styles.emptyIconText}>📋</Text>
          </View>
        </View>
        
        <Text style={[styles.emptyTitle, { color: theme.colors.primary }]}>
          {hasActiveFilters 
            ? 'No se encontraron proyectos' 
            : 'Aún no hay proyectos'}
        </Text>
        
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {hasActiveFilters 
            ? 'No hay resultados que coincidan con tu búsqueda. Prueba con otros criterios o limpia los filtros.'
            : 'Aún no se han registrado proyectos en el sistema. Vuelve a intentarlo más tarde.'}
        </Text>
        
        {hasActiveFilters && (
          <Button 
            title="Limpiar filtros" 
            onPress={() => handleFilterChange({})}
            variant="secondary"
          />
        )}
        
        <Button 
          title="Actualizar" 
          onPress={handleRefresh} 
          variant="primary"
        />
      </View>
    );
  };

  const renderFooter = () => (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Cargando proyectos...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <Button 
            title="Reintentar" 
            onPress={() => loadProjects(currentPage, filterParams)}
            variant="primary"
          />
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={({ item }) => (
            <ProjectCard 
              project={item} 
              onViewDetails={handleViewProjectDetails}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            projects.length === 0 && styles.emptyListContent
          ]}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={projects.length > 0 ? renderFooter : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 100,
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
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 