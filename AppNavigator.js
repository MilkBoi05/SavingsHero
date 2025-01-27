import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators  } from '@react-navigation/stack';

import SavingsGoalScreen from './SavingsGoalScreen';
import DateSelectionScreen from './DateSelectionScreen';
import NotificationsOnboarding from './NotificationsOnboarding';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={({ route }) => {
        const isBackAction = route.params?.fromBackButton || false;

        return {
          headerShown: false,
          gestureDirection: isBackAction ? 'horizontal-inverted' : 'horizontal', // Slide left if back
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // iOS-like animation
        };
      }}>
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
