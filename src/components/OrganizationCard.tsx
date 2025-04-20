import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
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
    // Navegar a la organización con ID y slug
    navigation.navigate('ONGs', { 
      ongId: organization.id, 
      slug: organization.slug || generateSlug(organization.name)
    });
  };

  // Placeholder para imagen si no hay una disponible
  const fallbackImage = { uri: 'https://as1.ftcdn.net/v2/jpg/13/26/83/50/1000_F_1326835055_xWwsKmGQesgjMyKJeczSBFmWWqPhPaXF.jpg' };
  
  // Obtener la URL de la imagen de la organización
  let imageUrl = fallbackImage.uri;
  
  // Tener en cuenta la estructura vista en la captura
  if (organization.images && organization.images.length > 0) {
    const mainImage = organization.images.find(img => img.is_main === true);
    if (mainImage && mainImage.path) {
      imageUrl = mainImage.path;
    } else if (organization.images[0].path) {
      imageUrl = organization.images[0].path;
    }
  } else if (organization.mainImage) {
    imageUrl = organization.mainImage;
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
        
        {/* Insignia de ubicación */}
        <View style={[styles.badge, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.badgeText, { color: theme.colors.textPrimary }]}>
            {organization.country || 'ONG'}
          </Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.name, { color: theme.colors.primary }]}>
          {organization.name}
        </Text>
        
        <Text 
          style={[styles.description, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {organization.description}
        </Text>
        
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Dirigida por {organization.responsibleName}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.socialLinks}>
            {organization.websiteUrl && (
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: theme.colors.primaryLight }]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleOpenLink(organization.websiteUrl || '');
                }}
              >
                <Text style={[styles.socialButtonText, { color: theme.colors.primary }]}>Web</Text>
              </TouchableOpacity>
            )}
            
            {organization.facebookUrl && (
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: theme.colors.primaryLight }]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleOpenLink(organization.facebookUrl || '');
                }}
              >
                <Text style={[styles.socialButtonText, { color: theme.colors.primary }]}>FB</Text>
              </TouchableOpacity>
            )}
            
            {organization.instagramUrl && (
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: theme.colors.primaryLight }]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleOpenLink(organization.instagramUrl || '');
                }}
              >
                <Text style={[styles.socialButtonText, { color: theme.colors.primary }]}>IG</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleViewDetails}
          >
            <Text style={[styles.detailsButtonText, { color: theme.colors.white }]}>
              Ver
            </Text>
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
  badge: {
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 6,
  },
  socialButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
  }
}); 