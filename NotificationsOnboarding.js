import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const NotificationsOnboarding = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    RussoOne_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = [
    'Select all',
    'Payment updates',
    'Progress updates',
    'Motivational messages',
    'Savings advice',
  ];

  const { goalDuration, weeksUntilGoal, savingsGoal, currentlySaved, goalDate } = route.params;

  const toggleOption = (option) => {
    if (option === 'Select all') {
      // If "Select all" is toggled, either select all options or deselect all
      if (selectedOptions.includes('Select all')) {
        // Deselect all options
        setSelectedOptions([]);
      } else {
        // Select all options
        setSelectedOptions([...options]);
      }
    } else {
      // Toggle individual options
      const updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option) // Remove the option
        : [...selectedOptions, option]; // Add the option

      // If all options except "Select all" are selected, include "Select all"
      if (
        updatedOptions.length === options.length - 1 &&
        !updatedOptions.includes('Select all')
      ) {
        updatedOptions.push('Select all');
      }

      // If any option is deselected, remove "Select all"
      if (selectedOptions.includes('Select all') && updatedOptions.length < options.length) {
        updatedOptions.splice(updatedOptions.indexOf('Select all'), 1);
      }

      setSelectedOptions(updatedOptions);
    }
  };

  const handleNext = () => {
    navigation.navigate('Dashboard', {
      savingsGoal: route.params.savingsGoal,
      currentlySaved: route.params.currentlySaved,
      goalDate: route.params.goalDate,
      goalDuration: route.params.goalDuration,
      weeksUntilGoal
    });
  };

  // Ensure fonts are loaded before rendering
  if (!fontsLoaded) {
    return null; // Render nothing or a loading spinner
  }


console.log('Goal date:', goalDate);

  return (
    <>
      <ScrollView bounces={false}>
        <View style={styles.formContainer}>
          <Text style={styles.NotificationHeading}>
            Set up notifications to keep you on track
          </Text>
          <Text style={styles.label}>Notification settings</Text>
          <View style={styles.optionStack}>
            {options.map((option, index) => (
              <View key={index} style={[styles.optionWrapper]}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => toggleOption(option)}
                >
                  <MaterialIcons
                    name={
                      selectedOptions.includes(option)
                        ? 'check-box'
                        : 'check-box-outline-blank'
                    }
                    size={24}
                    color="#A23DEF"
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
                {index !== options.length - 1 && (
                  <View style={styles.optionBorder} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {
          navigation.navigate('DateSelection', {
            fromBackButton: true, // Add a flag to indicate it's a back action
            startDate: route.params?.startDate || new Date().toISOString(),
            savingsGoal: route.params?.goalAmount || 0,
            savingAmount: route.params?.savingAmount || 0,
            frequency: route.params?.frequency || 'weekly',
            currentlySaved: route.params?.currentlySaved || 0,
            weeksUntilGoal: route.params.weeksUntilGoal,
            dateGoal: route.params.dateGoal
          });
        }}
      >
        <Text style={styles.skipButtonText}>Back</Text>
       </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Create goal</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default NotificationsOnboarding;
