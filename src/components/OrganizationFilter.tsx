import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
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

  const handleFilter = () => {
    const params: OrganizationParams = {};
    
    if (name.trim()) {
      params.name = name.trim();
    }
    
    if (responsibleName.trim()) {
      params.responsibleName = responsibleName.trim();
    }
    
    onFilter(params);
  };

  const handleReset = () => {
    setName('');
    setResponsibleName('');
    onFilter({});
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Buscar por nombre"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Buscar por responsable"
        value={responsibleName}
        onChangeText={setResponsibleName}
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.purplePrimary }]}
          onPress={handleFilter}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>Buscar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.resetButton, { borderColor: theme.colors.purplePrimary }]}
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, { color: theme.colors.purplePrimary }]}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
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