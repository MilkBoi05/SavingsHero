import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SavingsGoalScreen from './SavingsGoalScreen';
import DateSelectionScreen from './DateSelectionScreen';
import NotificationsOnboarding from './NotificationsOnboarding';
import Dashboard from './Dashboard';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null); // ✅ Wait before setting route

  useEffect(() => {
    const checkStoredGoal = async () => {
      try {
        console.log("🔍 Checking AsyncStorage for existing goal...");
        const savedGoal = await AsyncStorage.getItem('savingsGoal');

        if (savedGoal) {
          console.log("✅ Existing goal found! Redirecting to Dashboard");
          setInitialRoute('Dashboard');
        } else {
          console.log("⚠ No existing goal found. Starting at SavingsGoalScreen");
          setInitialRoute('SavingsGoal');
        }
      } catch (error) {
        console.error("❌ Error retrieving goal:", error);
        setInitialRoute('SavingsGoal'); // Ensure app still starts if there's an error
      }
    };

    checkStoredGoal();
  }, []);

  if (initialRoute === null) return null; // ✅ Prevent rendering until AsyncStorage loads

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // ✅ Now this is properly set before rendering
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="SavingsGoal" component={SavingsGoalScreen} />
        <Stack.Screen name="DateSelection" component={DateSelectionScreen} />
        <Stack.Screen name="NotificationsOnboarding" component={NotificationsOnboarding} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
