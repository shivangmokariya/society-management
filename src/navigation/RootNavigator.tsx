import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterSecretaryScreen } from '../screens/auth/RegisterSecretaryScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { AddOwnerScreen } from '../screens/forms/AddOwnerScreen';
import { AddTenantScreen } from '../screens/forms/AddTenantScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainApp">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterSecretary" component={RegisterSecretaryScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="AddOwner" component={AddOwnerScreen} />
        <Stack.Screen name="AddTenant" component={AddTenantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
