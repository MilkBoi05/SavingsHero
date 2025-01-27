import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import WeeksCarousel from './WeeksCarousel';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';
import { Merriweather_700Bold, Merriweather_900Black } from '@expo-google-fonts/merriweather';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import styles from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationsOnboarding from './NotificationsOnboarding';


const DateSelectionScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Merriweather_900Black,
    Merriweather_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });
  const carouselRef = useRef(null);
  const { startDate, savingsGoal, savingAmount, frequency, currentlySaved } = route.params;

  const [goalDate, setGoalDate] = useState('');
  const [goalDuration, setGoalDuration] = useState(0); // Store total weeks (numeric)
  const [displayDuration, setDisplayDuration] = useState('1'); // Store "weeks and days" string
  const [scrollingWeek, setScrollingWeek] = useState(0); // Track week during scroll
  const [updatedSavingAmount, setUpdatedSavingAmount] = useState(savingAmount);
  const [motivation, setMotivation] = useState('');
  const [savingRecurrence, setSavingRecurrence] = useState(frequency);
  const weeks = Array.from({ length: 260 }, (_, i) => i + 1); // Weeks from 1 to 260
  const debounceTimer = useRef(null); // Declare this at the top of your component
  const [isManualInput, setIsManualInput] = useState(false); // Track if the input is manual
  const [calculatedSavingAmount, setCalculatedSavingAmount] = useState(savingAmount); // New state
  const [lockScroll, setScrollLock] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);



  const frequencyMap = {
    weekly: 1,
    fortnightly: 2,
    monthly: 4.33, // Approx weeks in a month
  };

  const formatDuration = (weeks) => {
  
    if (weeks < 16) {
      // Return the duration in weeks if under 16 weeks
      return `${weeks} week${weeks === 1 ? '' : 's'}`;
    }
  
    // Calculate months and remaining weeks for 16 weeks or more
    const months = Math.floor(weeks / 4.33); // Approximate weeks in a month
    const remainingWeeks = Math.round(weeks % 4.33); // Remaining weeks
  
    return `${months} month${months === 1 ? '' : 's'}${
      remainingWeeks > 0 ? `, ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''
    }`;
  };

  

  const calculateGoalDetails = (selectedWeeks) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + selectedWeeks * 7); // Add weeks to start date
    const remainingAmount = savingsGoal - currentlySaved;
    const newSavingAmount =
      selectedWeeks > 0 ? Math.ceil(remainingAmount / selectedWeeks) : savingAmount;

    const formattedGoalDate = new Intl.DateTimeFormat('en-GB', {
       day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(start); // Format to "10 July 2025"

    return {
      goalDate: formattedGoalDate,
      savingAmount: updatedSavingAmount,
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

      console.log('goalDuration:', goalDuration);

  
      // Use a timeout to force re-render and ensure FlatList has been rendered
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollToWeek(weeksRequired); // Scroll to the correct week
        }
      }, 100); // Delay slightly to allow the FlatList to render
    };
  
    calculateInitialDetails();
  }, [savingsGoal, savingAmount, frequency, currentlySaved, savingRecurrence]);
  

  const handleScrollWeekChange = (() => {

    const debounceTimer = useRef(null);
  
    return (week) => {
      if (lockScroll) return;

      if (isManualInput) {
        return; // Ignore updates if scrollLock is active
      }
  
      // Immediate updates for goalDuration, goalDate, and scrollingWeek
      setGoalDuration(week);
      setScrollingWeek(week);
  
      const newGoalDate = new Date(startDate);
      newGoalDate.setDate(newGoalDate.getDate() + week * 7);
      setGoalDate(
        new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(newGoalDate)
      );
  
      const { months, weeks } = calculateMonthsAndWeeks(startDate, newGoalDate);
       setDisplayDuration(`${months} months${weeks > 0 ? `, ${weeks}` : ''}`);

      // Clear any ongoing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
  
      console.log('Manual Input Active SCroll Week:', isManualInput);

      // Debounced savings amount update
      debounceTimer.current = setTimeout(() => {
        if (!isManualInput) { // Avoid overwriting manually entered values
          const remainingAmount = savingsGoal - currentlySaved;
  
          if (remainingAmount > 0 && week > 0) {
            const calculatedSavingAmount = remainingAmount / week;
            setCalculatedSavingAmount(calculatedSavingAmount); // Update calculated value
            setUpdatedSavingAmount(calculatedSavingAmount); // Update savings amount after debounce
          }
        }
      }, 500); // 500ms delay
    };
  })();
  

  
  const handleWeekChange = (week) => {
    // Ignore updates if scrollLock is active
    if (lockScroll) return; 

    if (isManualInput) {
      return;
    }
  
    // Update goalDuration and scrollingWeek immediately
    setGoalDuration(week);
    setScrollingWeek(week);
  
    // Update goal date immediately
    const newGoalDate = new Date(startDate);
    newGoalDate.setDate(newGoalDate.getDate() + week * 7);
    setGoalDate(
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(newGoalDate)
    );
  
    // Only update savings amount if manual input is not active
    if (!isManualInput) {
      const remainingAmount = savingsGoal - currentlySaved;
  
      if (remainingAmount > 0 && week > 0) {
        const calculatedSavingAmount = remainingAmount / week;
        setUpdatedSavingAmount(calculatedSavingAmount);
      }
    }
  };
  
  
  
  
  
  useEffect(() => {
    if (!isManualInput && goalDuration > 0) {
      const remainingAmount = savingsGoal - currentlySaved;
  
      if (remainingAmount > 0) {
        const calculatedAmount = remainingAmount / goalDuration;
        setCalculatedSavingAmount(calculatedAmount); // For display
        setUpdatedSavingAmount(calculatedAmount); // Only update if not manually entered
      }

      console.log('Manual Input Active:', isManualInput);

    }
  }, [goalDuration, isManualInput, savingsGoal, currentlySaved]);
  
  
  
  
  
  
  
  
  const handleSavingAmountChange = (text) => {
    const inputAmount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
  
    // Set the manual input flag
    setIsManualInput(true);
    console.log('Manual Input Flag Set:', true);

  
    // Update the manually entered savings amount
    setUpdatedSavingAmount(inputAmount);
  
    // Debounce logic to update weeks based on the manually entered amount
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  
    debounceTimer.current = setTimeout(() => {
      const remainingAmount = savingsGoal - currentlySaved;
  
      if (remainingAmount > 0 && inputAmount > 0) {
        const calculatedWeeks = Math.ceil(remainingAmount / inputAmount); // Calculate weeks
        setGoalDuration(calculatedWeeks); // Update goal duration
        // setScrollingWeek(calculatedWeeks); // Sync carousel with weeks
  
        // Update goal date
        const newGoalDate = new Date(startDate);
        newGoalDate.setDate(newGoalDate.getDate() + calculatedWeeks * 7);
        setGoalDate(
          new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(newGoalDate)
        );
  
        const { months, weeks } = calculateMonthsAndWeeks(startDate, newGoalDate);
        setDisplayDuration(`${months} months${weeks > 0 ? `, ${weeks}` : ''}`);  

        if (carouselRef.current) {
          setScrollLock(true); // Lock updates during programmatic scrolling
          carouselRef.current.scrollToWeek(calculatedWeeks); // Sync carousel
          setTimeout(() => setScrollLock(false), 300); // Unlock after scrolling finishes
        }
      }
    }, 500); // Debounce delay
    console.log('Calc Saving Amount', calculatedSavingAmount);
    console.log('Updated Saving Amount', updatedSavingAmount);

  };
  
  const calculateMonthsAndWeeks = (startDate, goalDate) => {
    const start = new Date(startDate);
    const goal = new Date(goalDate);
  
    let months = 0;
  
    // Increment months until the next month surpasses the goal date
    while (start < goal) {
      const nextMonth = new Date(start);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
  
      if (nextMonth <= goal) {
        months++;
        start.setMonth(start.getMonth() + 1);
      } else {
        break;
      }
    }
  
    // Calculate remaining days after full months
    const remainingDays = Math.round((goal - start) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    const weeks = Math.floor(remainingDays / 7); // Convert remaining days to weeks
  
    return { months, weeks };
  };
  
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access the gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      // Add all selected images to the state
      setUploadedImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
            <Text style={styles.goalDuration}>{formatDuration(goalDuration) }</Text>
          </View>
          {goalDuration > 0 && (
            <WeeksCarousel
              ref={carouselRef}
              data={weeks} // Array of weeks
              selectedWeek={goalDuration} // Sync with parent state
              onScrollWeekChange={handleScrollWeekChange} // Immediate updates for goalDate, goalDuration
              onWeekChange={handleWeekChange} // Finalize updates after scrolling stops
              lockScroll={lockScroll}
              setScrollLock={setScrollLock} // Pass scrollLock setter
            />
          
          
          )}

        </View>

        <View style={styles.formContainer}>
          <View style={styles.rowGroup}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving amounts</Text>
              <TextInput
                style={styles.input}
                value={`$${Math.round(isManualInput ? updatedSavingAmount : calculatedSavingAmount) || 0}`}
                onChangeText={handleSavingAmountChange} // Handle manual input
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
            {uploadedImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri }}
                  style={{ width: 120, height: 120, borderRadius: 5 }}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={20} color="#434343" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.imageUploadButton} onPress={selectImage}>
              <Text style={styles.imageUploadText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            navigation.navigate('SavingsGoal', {
              fromBackButton: true,
              goalAmount: savingsGoal,
              savingAmount: updatedSavingAmount,
              currentlySaved: currentlySaved,
              startDate: startDate,
              frequency: savingRecurrence,
            });
          }}
        >
          <Text style={styles.skipButtonText}>Back</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('NotificationsOnboarding', {
            goalAmount: savingsGoal,
            savingAmount: updatedSavingAmount,
            currentlySaved: currentlySaved,
            startDate: startDate,
            frequency: savingRecurrence,
          })}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default DateSelectionScreen;