import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { Organization } from '../services/api';

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const theme = useTheme<Theme>();

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.white }]}>
      <Text style={[styles.name, { color: theme.colors.purplePrimary }]}>{organization.name}</Text>
      <Text style={[styles.description, { color: theme.colors.textPrimary }]}>{organization.description}</Text>
      
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Responsable:</Text>
        <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>{organization.responsibleName}</Text>
        
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Email:</Text>
        <Text 
          style={[styles.contactText, styles.link, { color: theme.colors.purplePrimary }]}
          onPress={() => Linking.openURL(`mailto:${organization.responsibleEmail}`)}
        >
          {organization.responsibleEmail}
        </Text>
        
        <Text style={[styles.contactTitle, { color: theme.colors.textPrimary }]}>Teléfono:</Text>
        <Text 
          style={[styles.contactText, styles.link, { color: theme.colors.purplePrimary }]}
          onPress={() => Linking.openURL(`tel:${organization.responsiblePhone}`)}
        >
          {organization.responsiblePhone}
        </Text>
      </View>
      
      <View style={styles.socialLinks}>
        {organization.websiteUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.colors.purplePrimary }]}
            onPress={() => handleOpenLink(organization.websiteUrl || '')}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Sitio Web</Text>
          </TouchableOpacity>
        )}
        
        {organization.facebookUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
            onPress={() => handleOpenLink(organization.facebookUrl || '')}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Facebook</Text>
          </TouchableOpacity>
        )}
        
        {organization.instagramUrl && (
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: '#C13584' }]}
            onPress={() => handleOpenLink(organization.instagramUrl || '')}
          >
            <Text style={[styles.socialButtonText, { color: theme.colors.white }]}>Instagram</Text>
          </TouchableOpacity>
        )}
      </View>
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