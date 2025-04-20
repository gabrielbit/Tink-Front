import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Organization } from '../services/api';
import { useNavigation } from '@react-navigation/native';

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<any>();

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  // Función para generar un slug si no existe
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/--+/g, '-'); // Remover guiones duplicados
  };

  const handleViewDetails = () => {
    // Generar slug si no existe
    const slug = organization.slug || generateSlug(organization.name);
    
    // Navegar a la organización con ID y slug
    navigation.navigate('ONGs', { 
      ongId: organization.id, 
      slug
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.white }]}
      onPress={handleViewDetails}
    >
      <Text style={[styles.name, { color: theme.colors.purplePrimary }]}>{organization.name}</Text>
      <Text style={[styles.description, { color: theme.colors.textPrimary }]}>{organization.description}</Text>
      
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Responsable:</Text>
        <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>{organization.responsibleName}</Text>
        
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Email:</Text>
        <Text 
          style={[styles.contactText, styles.link, { color: theme.colors.purplePrimary }]}
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(`mailto:${organization.responsibleEmail}`);
          }}
        >
          {organization.responsibleEmail}
        </Text>
        
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Teléfono:</Text>
        <Text 
          style={[styles.contactText, styles.link, { color: theme.colors.purplePrimary }]}
          onPress={(e) => {
            e.stopPropagation();
            Linking.openURL(`tel:${organization.responsiblePhone}`);
          }}
        >
          {organization.responsiblePhone}
        </Text>
      </View>
      
      <View style={styles.socialLinks}>
        {organization.websiteUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.colors.purplePrimary }]}
            onPress={(e) => {
              e.stopPropagation();
              handleOpenLink(organization.websiteUrl || '');
            }}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Sitio Web</Text>
          </TouchableOpacity>
        )}
        
        {organization.facebookUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
            onPress={(e) => {
              e.stopPropagation();
              handleOpenLink(organization.facebookUrl || '');
            }}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Facebook</Text>
          </TouchableOpacity>
        )}
        
        {organization.instagramUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#C13584' }]}
            onPress={(e) => {
              e.stopPropagation();
              handleOpenLink(organization.instagramUrl || '');
            }}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Instagram</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  socialButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600',
  }
}); 