import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { ProjectParams } from '../services/api';

interface ProjectFilterProps {
  onFilter: (params: ProjectParams) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({ onFilter }) => {
  const theme = useTheme<Theme>();
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const handleFilter = () => {
    const params: ProjectParams = {};
    
    if (title.trim()) {
      params.title = title.trim();
    }
    
    if (country.trim()) {
      params.country = country.trim();
    }
    
    if (city.trim()) {
      params.city = city.trim();
    }
    
    onFilter(params);
  };

  const handleReset = () => {
    setTitle('');
    setCountry('');
    setCity('');
    onFilter({});
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.purplePrimary }]}
        placeholder="Buscar por título"
        value={title}
        onChangeText={setTitle}
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput, { borderColor: theme.colors.purplePrimary }]}
          placeholder="País"
          value={country}
          onChangeText={setCountry}
        />
        
        <TextInput
          style={[styles.input, styles.halfInput, { borderColor: theme.colors.purplePrimary }]}
          placeholder="Ciudad"
          value={city}
          onChangeText={setCity}
        />
      </View>
      
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  halfInput: {
    width: '48%',
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