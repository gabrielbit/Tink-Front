import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl, Image, Alert, Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { fetchOrganizations, Organization, OrganizationParams } from '../services/api';
import { OrganizationCard } from '../components/OrganizationCard';
import { OrganizationFilter } from '../components/OrganizationFilter';
import { Pagination } from '../components/Pagination';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { Props } from '../navigation/types';

export const ONGsScreen = ({ navigation }: Props) => {
  const theme = useTheme<Theme>();
  const { logout } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterParams, setFilterParams] = useState<OrganizationParams>({});
  const pageSize = 10;
  
  // Obtener las dimensiones de la pantalla para diseño responsive
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Determinar el número de columnas según el ancho de la pantalla
  const getColumnCount = () => {
    if (!isWeb) return 1; // Móvil siempre 1 columna
    
    if (width > 1400) return 3; // Pantallas muy anchas: 3 columnas
    if (width > 800) return 2; // Pantallas medianas: 2 columnas
    return 1; // Pantallas pequeñas: 1 columna
  };
  
  const columnCount = getColumnCount();

  const loadOrganizations = async (page: number, params: OrganizationParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: OrganizationParams = {
        ...params,
        page,
        limit: pageSize,
      };
      
      const response = await fetchOrganizations(queryParams);
      
      setOrganizations(response.organizations);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setCurrentPage(response.pagination.currentPage);
    } catch (err: any) {
      console.error('Error loading organizations:', err);
      
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
        setError('No se pudieron cargar las organizaciones. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrganizations(1, filterParams);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrganizations(1, filterParams);
  };

  const handleFilterChange = (params: OrganizationParams) => {
    setFilterParams(params);
    loadOrganizations(1, params);
  };

  const handlePageChange = (page: number) => {
    loadOrganizations(page, filterParams);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <OrganizationFilter onFilter={handleFilterChange} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Organizaciones
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {totalItems} {totalItems === 1 ? 'organización encontrada' : 'organizaciones encontradas'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => {
    // Si hay filtros activos, mostramos un mensaje específico
    const hasActiveFilters = filterParams.name || filterParams.responsibleName || filterParams.responsibleEmail;
    
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
            ? 'No se encontraron organizaciones' 
            : 'Aún no hay organizaciones'}
        </Text>
        
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {hasActiveFilters 
            ? 'No hay resultados que coincidan con tu búsqueda. Prueba con otros criterios o limpia los filtros.'
            : 'Aún no se han registrado organizaciones en el sistema. Vuelve a intentarlo más tarde.'}
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
          Cargando organizaciones...
        </Text>
      </View>
    );
  }

  // Renderizar el contenido de manera diferente según la plataforma
  const content = (
    <FlatList
      data={organizations}
      renderItem={({ item }) => <OrganizationCard organization={item} />}
      key={`column-${columnCount}`}
      numColumns={columnCount}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        organizations.length === 0 && styles.emptyListContent,
        isWeb && styles.webListContent
      ]}
      columnWrapperStyle={columnCount > 1 ? styles.columnWrapper : undefined}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={organizations.length > 0 ? renderFooter : null}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <Button 
            title="Reintentar" 
            onPress={() => loadOrganizations(currentPage, filterParams)}
            variant="primary"
          />
        </View>
      ) : (
        <View style={[styles.contentWrapper, isWeb && styles.webContentWrapper]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
  webContentWrapper: {
    alignItems: 'center',
  },
  webListContent: {
    maxWidth: 1600,
    width: '100%',
    alignSelf: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  header: {
    padding: 16,
    backgroundColor: 'transparent',
    width: '100%',
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