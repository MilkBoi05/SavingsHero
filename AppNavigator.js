import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SavingsGoalScreen from './SavingsGoalScreen';
import DateSelectionScreen from './DateSelectionScreen';
import NotificationsOnboarding from './NotificationsOnboarding';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SavingsGoal">
        <Stack.Screen
          name="SavingsGoal"
          component={SavingsGoalScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DateSelection"
          component={DateSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationsOnboarding"
          component={NotificationsOnboarding}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
