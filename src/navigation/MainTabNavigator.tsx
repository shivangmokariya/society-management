import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { PeopleScreen } from '../screens/main/PeopleScreen';
import { FinanceScreen } from '../screens/main/FinanceScreen';
import { OperationsScreen } from '../screens/main/OperationsScreen';
import { MoreOptionsScreen } from '../screens/main/MoreOptionsScreen';
import { BottomTabBar } from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="People" component={PeopleScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Operations" component={OperationsScreen} />
      <Tab.Screen name="MoreOptions" component={MoreOptionsScreen} />
    </Tab.Navigator>
  );
};
