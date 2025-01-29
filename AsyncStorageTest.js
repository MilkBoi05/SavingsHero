import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageTest = () => {
  const [storedGoal, setStoredGoal] = useState(null);

  const saveGoal = async () => {
    try {
      const goalData = { savingsGoal: 1000, goalDate: '2025-12-31' };
      console.log("📝 Attempting to save goal:", goalData);
      
      await AsyncStorage.setItem('savingsGoal', JSON.stringify(goalData));
      console.log("✅ Goal successfully saved to AsyncStorage!");
    } catch (error) {
      console.error("❌ Error saving goal:", error);
    }
  };

  const loadGoal = async () => {
    try {
      console.log("🔍 Checking for stored goal...");
      
      const savedGoal = await AsyncStorage.getItem('savingsGoal');
      console.log("📦 Raw stored value from AsyncStorage:", savedGoal);

      if (savedGoal) {
        const parsedGoal = JSON.parse(savedGoal);
        console.log("✅ Goal successfully retrieved:", parsedGoal);
        setStoredGoal(parsedGoal);
      } else {
        console.log("⚠ No goal found in AsyncStorage!");
      }
    } catch (error) {
      console.error("❌ Error retrieving goal:", error);
    }
  };

  return (
    <View>
      <Button title="Save Goal" onPress={saveGoal} />
      <Button title="Load Goal" onPress={loadGoal} />
      <Text>Stored Goal: {storedGoal ? JSON.stringify(storedGoal) : "None"}</Text>
    </View>
  );
};

export default AsyncStorageTest;
