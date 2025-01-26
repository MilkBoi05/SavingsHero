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
  Button,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DateSelection from './DateSelectionScreen';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';

import styles from './styles';

const IntroImage = require('./assets/Saving money-amico.png');
const LogoImg = require('./assets/Logo.png');

const SavingsGoalScreen = ({ navigation, route }) => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    RussoOne_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  // Component states
  
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [values, setValues] = useState({
    goalAmount: route?.params?.updatedSavingsGoal || '$',
    savingAmount: route?.params?.updatedSavingAmount || '$',
    currentlySaved: route?.params?.updatedCurrentlySaved || '$',
  });
  const [goalType, setGoalType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    route?.params?.startDate || new Date()
  );
  const [savingRecurrence, setSavingRecurrence] = useState(
    route?.params?.frequency || 'weekly'
  );

  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentType, setPaymentType] = useState('Automatically');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const handleConfirm = (date) => {
    setSelectedDate(date); // Set the selected date
    setPickerVisible(false); // Hide the picker
  };
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const [errors, setErrors] = useState({ goalAmount: '', savingAmount: '' });

  // Animated sliding fill
  const slideAnim = useRef(new Animated.Value(paymentType === 'Automatically' ? 0 : 1)).current;

  const handleToggle = (type) => {
    setPaymentType(type); // Update the selected payment type
    Animated.timing(slideAnim, {
      toValue: type === 'Automatically' ? 0 : 1, // Adjust slide position based on selected type
      duration: 300,
      useNativeDriver: false, // Disable native driver for styling-related animations
    }).start();
  };


  const handleChangeText = (field, text) => {
    const inputText = text || ''; // Ensure `text` is at least an empty string
    const sanitizedText = inputText.replace(/[^0-9.]/g, ''); // Remove invalid characters
  
    // Add commas every three digits
    const formattedText = sanitizedText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    setValues((prevValues) => ({
      ...prevValues,
      [field]: sanitizedText ? `$${formattedText}` : '$', // Always keep the "$" symbol
    }));
  };
  
  const validateFields = (values) => {
    const errors = {};
  
    const goalAmountValue = parseFloat(values.goalAmount.replace(/[^0-9.]/g, '')) || 0;
    const savingAmountValue = parseFloat(values.savingAmount.replace(/[^0-9.]/g, '')) || 0;
  
    // Validate Goal Amount
    if (goalAmountValue <= 0) {
      errors.goalAmount = 'Goal amount must be greater than $0';
    }
  
    // Validate Contribution Amount
    if (savingAmountValue <= 0) {
      errors.savingAmount = 'Contribution amount must be greater than $0';
    }
  
    // Validate Contribution <= Goal Amount
    if (savingAmountValue > goalAmountValue) {
      errors.savingAmount = 'Contribution amount cannot be greater than goal amount';
    }
  
    return errors;
  };

  const handleNextPress = () => {
    if (!validateFields()) {
      return; // Stop navigation if validation fails
    }

    navigation.navigate('DateSelection', {
      startDate: selectedDate,
      savingsGoal: parseFloat(values.goalAmount.replace(/[^0-9.]/g, '')),
      savingAmount: parseFloat(values.savingAmount.replace(/[^0-9.]/g, '')),
      frequency: savingRecurrence,
      currentlySaved: parseFloat(values.currentlySaved.replace(/[^0-9.]/g, '')) || 0,
    });
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

  const [textColor, setTextColor] = useState('black');



  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (

    <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={-120}
        >
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
                    itemTextStyle={{color:"#434343"}}
                    selectedTextStyle={{color:"#434343"}}
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
                value={values.goalAmount === '$' ? '' : values.goalAmount}
                placeholder="$0"
                onChangeText={(text) => handleChangeText('goalAmount', text)}
                placeholderTextColor="#8E9AA5"
                keyboardType="numeric"
              />
              {errors.goalAmount ? <Text style={styles.errorText}>{errors.goalAmount}</Text> : null}

              <View style={styles.rowGroup}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Contribution amount</Text>
                  <TextInput
                    style={styles.input}
                    value={values.savingAmount === '$' ? '' : values.savingAmount}
                    onChangeText={(text) => handleChangeText('savingAmount', text)}
                    placeholder="$0"
                    placeholderTextColor="#8E9AA5"
                    keyboardType="numeric"
                  />
                  {errors.savingAmount ? <Text style={styles.errorText}>{errors.savingAmount}</Text> : null}
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Frequency</Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={recurrenceOptions}
                    itemTextStyle={{color:"#434343"}}
                    selectedTextStyle={{color:"#434343"}}
                    labelField="label"
                    valueField="value"
                    value={savingRecurrence} // Controlled value from state
                    onChange={(item) => {
                      if (item && item.value) {
                        setSavingRecurrence(item.value); // Ensure item is valid before accessing `value`
                      }
                    }}
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
                <Text style={styles.label}>
                  Start date
                </Text>
                <TouchableOpacity
                  style={styles.openModalButton}
                  onPress={() => setPickerVisible(true)}>
                  <Text style={styles.openModalButtonText}>
                    {`${new Intl.DateTimeFormat('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(selectedDate)}`}
                  </Text>

                </TouchableOpacity>
                
                {/* Modal Date Picker */}
                <DateTimePickerModal
                  isVisible={isPickerVisible}
                  buttonTextColorIOS="#a23DEF"
                  display='inline'
                  textColor={textColor}
                  themeVariant="light"
                  mode="date"
                  // modalStyleIOS={{
                  //   alignItems: 'center',
                  //   width: 400,
                  //   paddingLeft: 12
                  // }}
                  // pickerContainerStyleIOS={{
                  //   alignItems: 'center',
                  //   width: 400,
                  //   paddingLeft: 0
                  // }}
                  onConfirm={(date) => {
                    console.log("Confirmed date:", date);
                    setSelectedDate(date);
                    hidePicker();
                  }}
                  onCancel={hidePicker}
                />


              </View>
            

              <Text style={styles.label}>Currently saved</Text>
              <TextInput style={styles.input}
              value={values.currentlySaved === '$' ? '' : values.currentlySaved}
              onChangeText={(text) => handleChangeText('currentlySaved', text)} 
              onBlur={() => {
                if (values.currentlySaved === '$') {
                  handleChangeText('currentlySaved', '0'); // Set to $0 if left empty
                }
              }}
              placeholder="$0" 
              keyboardType="numeric" />
            </View>

          </ScrollView>        
        </KeyboardAvoidingView>            

        {/* Buttons */}
        <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} 
        
        onPress={() => {
          const validationErrors = validateFields(values); // Call the validation function
      
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Display validation errors
            return; // Prevent navigation
          }
      
          // If no errors, navigate to the next screen
          setErrors({}); // Clear any previous errors
          navigation.navigate('DateSelection', {
            startDate: selectedDate, // Pass selected start date
            savingsGoal: parseFloat(values.goalAmount.replace(/[^0-9.]/g, '')) || 0,
            savingAmount: parseFloat(values.savingAmount.replace(/[^0-9.]/g, '')) || 0,
            frequency: savingRecurrence,
            currentlySaved: parseFloat(values.currentlySaved.replace(/[^0-9.]/g, '')) || 0,
          });
        }}
        >
        <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        </View>
      </View>
    
  );
};

export default SavingsGoalScreen;

/*onst SummaryScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Summary Screen</Text>
    </View>
  );
};*/
