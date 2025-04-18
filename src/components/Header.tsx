import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.purplePrimary }]}>
      {/* Menú */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <View style={styles.menuIcon}>
          <View style={[styles.menuLine, { backgroundColor: theme.colors.white }]} />
          <View style={[styles.menuLine, { backgroundColor: theme.colors.white }]} />
          <View style={[styles.menuLine, { backgroundColor: theme.colors.white }]} />
        </View>
      </TouchableOpacity>

      {/* Logo */}
      <Text style={[styles.title, { color: theme.colors.white }]}>Tink</Text>

      {/* Perfil */}
      <View style={styles.profileContainer}>
        {user?.profilePic ? (
          <Image 
            source={{ uri: user.profilePic }} 
            style={styles.profilePic} 
          />
        ) : (
          <View style={[styles.profilePlaceholder, { backgroundColor: theme.colors.purpleLight }]}>
            <Text style={[styles.profileInitial, { color: theme.colors.white }]}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    width: '100%',
    borderRadius: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 