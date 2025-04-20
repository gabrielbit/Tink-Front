import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';

// Definir una interfaz específica para este navegador
export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
};

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export const ProjectsStackNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="ProjectsList"
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="ProjectsList" 
        component={ProjectsScreen} 
      />
      <Stack.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen} 
      />
    </Stack.Navigator>
  );
}; 