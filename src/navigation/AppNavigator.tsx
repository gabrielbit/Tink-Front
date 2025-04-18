import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from '../screens/HomeScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ONGsScreen } from '../screens/ONGsScreen';
import { Header } from '../components/Header';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const theme = useTheme<Theme>();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Inicio', screen: 'Home', icon: '🏠' },
    { name: 'Proyectos', screen: 'Projects', icon: '📋' },
    { name: 'ONGs', screen: 'ONGs', icon: '🌍' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={[styles.drawerContainer, { backgroundColor: theme.colors.mainBackground }]}>
      <View style={[styles.drawerHeader, { backgroundColor: theme.colors.purplePrimary }]}>
        <Text style={[styles.drawerTitle, { color: theme.colors.white }]}>
          Menú Tink
        </Text>
        {user && (
          <Text style={[styles.userName, { color: theme.colors.white }]}>
            {user.name}
          </Text>
        )}
      </View>
      <View style={styles.drawerContent}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate(item.screen)}
          >
            <Text style={styles.drawerItemIcon}>{item.icon}</Text>
            <Text style={[styles.drawerItemText, { color: theme.colors.textPrimary }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.purplePrimary }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: theme.colors.white }]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export const AppNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: (props) => <Header onMenuPress={() => props.navigation.openDrawer()} />,
        drawerStyle: { width: '70%' },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }}
      />
      <Drawer.Screen 
        name="Projects" 
        component={ProjectsScreen} 
        options={{ title: 'Proyectos' }}
      />
      <Drawer.Screen 
        name="ONGs" 
        component={ONGsScreen} 
        options={{ title: 'ONGs' }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    opacity: 0.9,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 