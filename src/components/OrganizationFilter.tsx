import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { OrganizationParams } from '../services/api';

interface OrganizationFilterProps {
  onFilter: (params: OrganizationParams) => void;
}

export const OrganizationFilter: React.FC<OrganizationFilterProps> = ({ onFilter }) => {
  const theme = useTheme<Theme>();
  const [name, setName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Para saber si hay filtros activos
  const hasActiveFilters = name.trim() || responsibleName.trim();

  const handleFilter = () => {
    const params: OrganizationParams = {};
    
    if (name.trim()) {
      params.name = name.trim();
    }
    
    if (responsibleName.trim()) {
      params.responsibleName = responsibleName.trim();
    }
    
    onFilter(params);
    setShowFilters(false);
  };

  const handleReset = () => {
    setName('');
    setResponsibleName('');
    onFilter({});
  };

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.filterButton, 
          hasActiveFilters ? { backgroundColor: theme.colors.primaryLight } : undefined
        ]} 
        onPress={() => setShowFilters(true)}
      >
        <Text style={styles.filterIcon}>🔍</Text>
        {hasActiveFilters && (
          <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.filterBadgeText, { color: theme.colors.white }]}>
              ✓
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.filterContainer, { backgroundColor: theme.colors.white }]}>
            <View style={styles.filterHeader}>
              <Text style={[styles.filterTitle, { color: theme.colors.primary }]}>Filtrar Organizaciones</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary }]}
              placeholder="Buscar por nombre"
              value={name}
              onChangeText={setName}
            />
            
            <TextInput
              style={[styles.input, { borderColor: theme.colors.primary }]}
              placeholder="Buscar por responsable"
              value={responsibleName}
              onChangeText={setResponsibleName}
            />
            
            <View style={styles.buttonsContainer}>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={[styles.button, styles.resetButton, { borderColor: theme.colors.primary }]}
                  onPress={handleReset}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.primary }]}>Limpiar</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.button, 
                  { backgroundColor: theme.colors.primary },
                  hasActiveFilters ? { flex: 1 } : { flex: 2 }
                ]}
                onPress={handleFilter}
              >
                <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                  {hasActiveFilters ? 'Aplicar filtros' : 'Buscar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  filterIcon: {
    fontSize: 18,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterContainer: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  container: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  }
}); 