// Import required libraries
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Button
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import styles from './styles';

const IntroImage = require('./Saving money-amico.png');
const LogoImg = require('./Logo.png');

const showPicker = () => setPickerVisible(true);
const hidePicker = () => setPickerVisible(false);

const handleConfirm = (date) => {
  setSelectedDate(date); // Set the selected date
  hidePicker(); // Hide the picker
};

const SavingsGoalScreen = () => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    RussoOne_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  // Component states
  
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [goalType, setGoalType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentType, setPaymentType] = useState('Automatically');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  

  // Animated sliding fill
  const slideAnim = useRef(new Animated.Value(paymentType === 'Automatically' ? 0 : 1)).current;

  const handleToggle = (type) => {
    setPaymentType(type);
    Animated.timing(slideAnim, {
      toValue: type === 'Automatically' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const slidePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'], // Slides between the two options
  });

  const goalTypes = [
    { label: 'Vehicle', value: 'car' },
    { label: 'House', value: 'house' },
    { label: 'Holiday', value: 'vacation' },
    { label: 'Other', value: 'other' },
  ];

  const recurrenceOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Fortnightly', value: 'fortnightly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.LogoImg} source={LogoImg} />
          <Text style={styles.title}>SavingsHero</Text>
        </View>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <Text style={styles.heading}>Hello! Let’s create your first savings goal.</Text>
          <Image style={styles.introImage} source={IntroImage} />
        </View>

        {/* Form Section */}
        <View style={styles.formGroup}>
          <View style={styles.rowGroup}>
            <View style={styles.twoThirdsInput}>
              <Text style={styles.label}>Goal name</Text>
              <TextInput
                style={styles.input}
                placeholder="New car, house deposit"
                placeholderTextColor="#8E9AA5"
              />
            </View>
            <View style={styles.oneThirdInput}>
              <Text style={styles.label}>Goal type</Text>
              <Dropdown
                style={styles.dropdown}
                data={goalTypes}
                labelField="label"
                valueField="value"
                placeholder="Select"
                placeholderStyle={styles.placeholderStyle}
                value={goalType}
                onChange={(item) => setGoalType(item.value)}
              />
            </View>
          </View>

          <Text style={styles.label}>Goal amount</Text>
          <TextInput
            style={styles.input}
            placeholder="$0"
            placeholderTextColor="#8E9AA5"
            keyboardType="numeric"
          />

          <View style={styles.rowGroup}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving amount</Text>
              <TextInput
                style={styles.input}
                placeholder="$0"
                placeholderTextColor="#8E9AA5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving recurrence</Text>
              <Dropdown
                style={styles.dropdown}
                data={recurrenceOptions}
                labelField="label"
                valueField="value"
                value={recurrenceOptions[0].value}
                itemTextStyle={styles.itemTextStyle}
              />
            </View>
          </View>

          <Text style={styles.label}>Add payments to goal</Text>
          <View style={styles.section}>
            <View style={styles.toggleButtonGroup}>
              {/* Sliding Background */}
              <Animated.View style={[styles.slider, { left: slidePosition }]} />

              {/* Toggle Options */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleToggle('Automatically')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    paymentType === 'Automatically' && styles.toggleTextSelected,
                  ]}
                >
                  Automatically
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleToggle('Manually')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    paymentType === 'Manually' && styles.toggleTextSelected,
                  ]}
                >
                  Manually
                </Text>
              </TouchableOpacity>
            </View>
          </View>
 
          <View style={styles.container}>
            {/* Always visible field showing the date */}
            <Text style={styles.label}>Start date</Text>

            <View style={styles.dateInput}>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                accentColor="#A23DEF"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(true); // Close the picker
                  if (selectedDate) setStartDate(selectedDate); // Update the date
                }}
                >

              </DateTimePicker>
            </View>

         
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>
              Selected Date: {selectedDate.toLocaleDateString()}
            </Text>
            <Button title="Show Date Picker" onPress={showPicker} />

            {/* Modal Date Picker */}
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date" // "time" or "datetime" for other modes
              onConfirm={handleConfirm} // Handle date selection
              onCancel={hidePicker} // Handle cancel
            />
          </View>

          <Text style={styles.label}>Start date</Text>
          <Button title="Pick a Date" onPress={() => setPickerVisible(true)} />
          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setPickerVisible(false)}
          />


          

          <Text style={styles.label}>Currently saved</Text>
          <TextInput style={styles.input} placeholder="$0" keyboardType="numeric" />
        </View>
      </ScrollView>

        {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default SavingsGoalScreen;
