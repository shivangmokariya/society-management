import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterSecretaryScreen } from '../screens/auth/RegisterSecretaryScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { AddOwnerScreen } from '../screens/forms/AddOwnerScreen';
import { AddTenantScreen } from '../screens/forms/AddTenantScreen';
import { EditProfileScreen } from '../screens/main/EditProfileScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

const AppStack: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterSecretary" component={RegisterSecretaryScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
          <Stack.Screen name="AddOwner" component={AddOwnerScreen} />
          <Stack.Screen name="AddTenant" component={AddTenantScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
