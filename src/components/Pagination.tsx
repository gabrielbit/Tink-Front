import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const theme = useTheme<Theme>();

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Calcular el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Botón "Anterior"
    if (currentPage > 1) {
      pages.push(
        <TouchableOpacity
          key="prev"
          style={[styles.pageButton, { borderColor: theme.colors.purplePrimary }]}
          onPress={() => onPageChange(currentPage - 1)}
        >
          <Text style={{ color: theme.colors.purplePrimary }}>{'<'}</Text>
        </TouchableOpacity>
      );
    }
    
    // Primera página y elipsis si es necesario
    if (startPage > 1) {
      pages.push(
        <TouchableOpacity
          key="1"
          style={[styles.pageButton, { borderColor: theme.colors.purplePrimary }]}
          onPress={() => onPageChange(1)}
        >
          <Text style={{ color: theme.colors.purplePrimary }}>1</Text>
        </TouchableOpacity>
      );
      
      if (startPage > 2) {
        pages.push(
          <View key="ellipsis1" style={styles.ellipsis}>
            <Text style={{ color: theme.colors.textSecondary }}>...</Text>
          </View>
        );
      }
    }
    
    // Páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            i === currentPage 
              ? { backgroundColor: theme.colors.purplePrimary } 
              : { borderColor: theme.colors.purplePrimary }
          ]}
          onPress={() => onPageChange(i)}
          disabled={i === currentPage}
        >
          <Text 
            style={{ 
              color: i === currentPage ? theme.colors.white : theme.colors.purplePrimary 
            }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Elipsis y última página si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <View key="ellipsis2" style={styles.ellipsis}>
            <Text style={{ color: theme.colors.textSecondary }}>...</Text>
          </View>
        );
      }
      
      pages.push(
        <TouchableOpacity
          key={totalPages}
          style={[styles.pageButton, { borderColor: theme.colors.purplePrimary }]}
          onPress={() => onPageChange(totalPages)}
        >
          <Text style={{ color: theme.colors.purplePrimary }}>{totalPages}</Text>
        </TouchableOpacity>
      );
    }
    
    // Botón "Siguiente"
    if (currentPage < totalPages) {
      pages.push(
        <TouchableOpacity
          key="next"
          style={[styles.pageButton, { borderColor: theme.colors.purplePrimary }]}
          onPress={() => onPageChange(currentPage + 1)}
        >
          <Text style={{ color: theme.colors.purplePrimary }}>{'>'}</Text>
        </TouchableOpacity>
      );
    }
    
    return pages;
  };

  // Si solo hay una página, no mostrar la paginación
  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      {renderPageNumbers()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    flexWrap: 'wrap',
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  }
}); 