import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styles from './styles';

const DateSelectionScreen = ({ route, navigation }) => {
  const { startDate, savingsGoal, savingAmount, frequency, currentlySaved } = route.params;

  const [goalDate, setGoalDate] = useState(startDate); // Initialize with start date
  const [goalDuration, setGoalDuration] = useState(0); // Weeks to achieve goal

  // Frequency Mapping to Weeks
  const frequencyMap = {
    weekly: 1,
    fortnightly: 2,
    monthly: 4.33, // Approx weeks in a month
  };

  useEffect(() => {
    // Calculate remaining savings needed
    const remainingSavings = savingsGoal - currentlySaved;

    // Calculate weeks needed based on savings amount and frequency
    const weeksToGoal = Math.ceil(remainingSavings / savingAmount) * frequencyMap[frequency.toLowerCase()];

    // Calculate the goal date
    const calculatedGoalDate = new Date(startDate);
    calculatedGoalDate.setDate(calculatedGoalDate.getDate() + weeksToGoal * 7);

    // Update state
    setGoalDate(calculatedGoalDate);
    setGoalDuration(weeksToGoal);
  }, [startDate, savingsGoal, savingAmount, frequency, currentlySaved]);

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.headerText}>
          At that rate, you will achieve your savings goal by...
        </Text>
        <View style={styles.goalDateContainer}>
          <Text style={styles.goalDate}>
            {goalDate.toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })}
          </Text>
          <Text style={styles.goalDuration}>{goalDuration} weeks</Text>
        </View>
      </View>

      {/* Rest of the UI */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Example inputs */}
        <Text style={styles.label}>Motivation (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Explain your motivations to achieve this goal"
          multiline
        />
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DateSelectionScreen;
