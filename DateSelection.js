import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import WeeksCarousel from './WeeksCarousel';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Merriweather_700Bold, Merriweather_900Black } from '@expo-google-fonts/merriweather';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import styles from './styles';

const DateSelectionScreen = ({ navigation, route }) => {
  const { startDate, savingsGoal, savingAmount, frequency, currentlySaved } = route.params;

  const [goalDate, setGoalDate] = useState('');
  const [goalDuration, setGoalDuration] = useState(0);
  const [scrollingWeek, setScrollingWeek] = useState(0); // Track week during scroll
  const [updatedSavingAmount, setUpdatedSavingAmount] = useState(savingAmount);
  const [motivation, setMotivation] = useState('');
  const [savingRecurrence, setSavingRecurrence] = useState(frequency);
  const weeks = Array.from({ length: 260 }, (_, i) => i + 1); // Weeks from 1 to 100

  const frequencyMap = {
    weekly: 1,
    fortnightly: 2,
    monthly: 4.33, // Approx weeks in a month
  };

  const calculateGoalDetails = (selectedWeeks) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + selectedWeeks * 7); // Add weeks to start date
    const remainingAmount = savingsGoal - currentlySaved;
    const newSavingAmount =
      selectedWeeks > 0 ? Math.ceil(remainingAmount / selectedWeeks) : savingAmount;

    return {
      goalDate: start.toDateString(),
      savingAmount: newSavingAmount,
    };
  };

  useEffect(() => {
    const calculateInitialDetails = () => {
      const remainingAmount = savingsGoal - currentlySaved;

      if (remainingAmount <= 0) {
        setGoalDate('Goal Achieved!');
        setGoalDuration(0);
        setScrollingWeek(0);
        return;
      }

      const intervalWeeks = frequencyMap[savingRecurrence] || 1; // Default to weekly
      const weeksRequired = Math.ceil(remainingAmount / (savingAmount * intervalWeeks));
      const { goalDate } = calculateGoalDetails(weeksRequired);

      setGoalDuration(weeksRequired); // Set initial weeks
      setScrollingWeek(weeksRequired); // Align scrolling week
      setGoalDate(goalDate); // Set goal date
    };

    calculateInitialDetails();
  }, [savingsGoal, savingAmount, frequency, currentlySaved, savingRecurrence]);

  const handleScrollWeekChange = (week) => {
    setScrollingWeek(week); // Visually update the week during scrolling
    const { goalDate } = calculateGoalDetails(week);
    setGoalDate(goalDate); // Update goal date dynamically
  };

  const handleWeekChange = (week) => {
    setGoalDuration(week); // Finalize the selected week
    const { savingAmount } = calculateGoalDetails(week);
    setUpdatedSavingAmount(savingAmount); // Update savings amount after scrolling stops
  };

  const handleSavingAmountChange = (text) => {
    const inputAmount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    setUpdatedSavingAmount(inputAmount); // Update the savings amount
    const remainingAmount = savingsGoal - currentlySaved;
    const newWeeks =
      inputAmount > 0 ? Math.ceil(remainingAmount / inputAmount) : goalDuration;
    setGoalDuration(newWeeks); // Update number of weeks
    setScrollingWeek(newWeeks); // Align the carousel
    const { goalDate } = calculateGoalDetails(newWeeks);
    setGoalDate(goalDate); // Update the goal date
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView bounces={false}>
        <View style={styles.dateHeader}>
          <Text style={styles.headerText}>
            At that rate, you will achieve your savings goal by...
          </Text>
          <View style={styles.goalDateContainer}>
            <Text style={styles.goalDate}>{goalDate}</Text>
            <Text style={styles.goalDuration}>{scrollingWeek} weeks</Text>
          </View>
          {goalDuration > 0 && (
            <WeeksCarousel
              data={weeks}
              selectedWeek={scrollingWeek}
              onScrollWeekChange={handleScrollWeekChange} // Update date dynamically as the user scrolls
              onWeekChange={handleWeekChange} // Trigger recalculations after scrolling stops
              scrollToWeek={goalDuration} // Snap to the correct week when savingAmount changes
            />
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.rowGroup}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving amount</Text>
              <TextInput
                style={styles.input}
                value={`$${updatedSavingAmount}`}
                onChangeText={handleSavingAmountChange} // Update weeks dynamically based on savings amount
                placeholderTextColor="#8E9AA5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving recurrence</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Fortnightly', value: 'fortnightly' },
                  { label: 'Monthly', value: 'monthly' },
                ]}
                itemTextStyle={{ color: '#434343' }}
                selectedTextStyle={{ color: '#434343' }}
                labelField="label"
                valueField="value"
                value={savingRecurrence}
                onChange={(item) => setSavingRecurrence(item.value)}
              />
            </View>
          </View>

          <Text style={styles.label}>Motivation (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={motivation}
            onChangeText={setMotivation}
            placeholder="Explain your motivations to achieve this goal"
            multiline
          />

          <Text style={styles.label}>Images (Optional)</Text>
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Text style={styles.imageUploadText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('SavingsGoal')}>
          <Text style={styles.skipButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Summary')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateSelectionScreen;
