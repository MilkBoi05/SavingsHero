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
  const recurrenceJustChanged = useRef(false);
  // const weeks = Array.from({ length: 52000 }, (_, i) => i + 1); // Weeks from 1 to 260
  const debounceTimer = useRef(null); // Declare this at the top of your component
  const [isManualInput, setIsManualInput] = useState(false); // Track if the input is manual
  const [calculatedSavingAmount, setCalculatedSavingAmount] = useState(savingAmount); // New state
  const [lockScroll, setScrollLock] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const generateDataArray = (recurrence) => {
    switch (recurrence) {
      case "weekly":
        return Array.from({ length: 52000 }, (_, i) => i + 1); // 260 weeks
      case "fortnightly":
        return Array.from({ length: 52000 }, (_, i) => i + 1); // 130 fortnights
      case "monthly":
        return Array.from({ length: 52000 }, (_, i) => i + 1); // 60 months
      default:
        return Array.from({ length: 52000 }, (_, i) => i + 1);
    }
  };
  
  const [weeks, setWeeks] = useState(generateDataArray(savingRecurrence));
  

  const frequencyMap = {
    weekly: 1,
    fortnightly: 2,
    monthly: 4.33, // Approx weeks in a month
  };

  const formatDuration = (periods) => {
    // Convert periods to weeks based on recurrence
    const weeksPerPeriod = {
      weekly: 1,
      fortnightly: 2,
      monthly: 4.33
    };
    const totalWeeks = periods * (weeksPerPeriod[savingRecurrence] || 1);

    if (savingRecurrence === 'monthly' && periods < 12) {
      // For monthly, show months directly if less than a year
      return `${periods} month${periods === 1 ? '' : 's'}`;
    } else if (savingRecurrence === 'fortnightly' && periods < 26) {
      // For fortnightly, show count if less than a year
      return `${periods} fortnight${periods === 1 ? '' : 's'}`;
    } else if (totalWeeks < 16) {
      // For weekly or small durations, show weeks
      return `${Math.round(totalWeeks)} week${totalWeeks === 1 ? '' : 's'}`;
    }

    // Calculate years and remaining time
    const years = Math.floor(totalWeeks / 52);
    const remainingWeeks = totalWeeks % 52;
    const months = Math.floor(remainingWeeks / 4.33);
    const finalWeeks = Math.round(remainingWeeks % 4.33);

    let duration = '';

    if (years > 0) {
      duration = `${years} year${years === 1 ? '' : 's'}`;
      
      if (months > 0) {
        duration += `, ${months} month${months === 1 ? '' : 's'}`;
      }
      
      if (finalWeeks > 0) {
        duration += `, ${finalWeeks} week${finalWeeks === 1 ? '' : 's'}`;
      }
    } else {
      if (months > 0) {
        duration = `${months} month${months === 1 ? '' : 's'}`;
        
        if (finalWeeks > 0) {
          duration += `, ${finalWeeks} week${finalWeeks === 1 ? '' : 's'}`;
        }
      } else if (finalWeeks > 0) {
        duration = `${finalWeeks} week${finalWeeks === 1 ? '' : 's'}`;
      }
    }

    return duration;
  };

  

  const calculateGoalDetails = (selectedWeeks) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + selectedWeeks * 7); // Add weeks to start date
    const remainingAmount = savingsGoal - currentlySaved;
    const newSavingAmount =
      selectedWeeks > 0 ? Math.ceil(remainingAmount / selectedWeeks) : savingAmount;

      const formattedGoalDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',  // ✅ Full month name (e.g., "July")
        day: 'numeric', // ✅ Numeric day (e.g., "10")
        year: 'numeric' // ✅ Full year (e.g., "2025")
      }).format(start);
       // Format to "10 July 2025"

    return {
      goalDate: formattedGoalDate,
      savingAmount: newSavingAmount
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
  
      const intervalWeeks = frequencyMap[savingRecurrence] || 1;
      // Calculate required periods based on frequency
      const periodsRequired = Math.ceil(remainingAmount / (updatedSavingAmount));
      // Convert periods to total weeks for date calculation
      const totalWeeks = periodsRequired * intervalWeeks;
      const { goalDate } = calculateGoalDetails(totalWeeks);
  
      setGoalDuration(periodsRequired); // Set number of periods (weeks/fortnights/months)
      setScrollingWeek(periodsRequired); // Align scrolling with periods
      setGoalDate(goalDate);
      
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollToWeek(periodsRequired);
        }
      }, 100);
    };
  
    calculateInitialDetails();
  }, [savingsGoal, savingAmount, frequency, currentlySaved, savingRecurrence]);

  const handleSavingRecurrenceChange = (value) => {
    console.log('Recurrence changing to:', value);
    recurrenceJustChanged.current = true;
    setSavingRecurrence(value);
    
    setWeeks(generateDataArray(value)); // ✅ Update the weeks array dynamically
  
    const remainingAmount = savingsGoal - currentlySaved;
    const oldIntervalFactor = frequencyMap[savingRecurrence]; // Old frequency (1 for weekly, 2 for fortnightly, etc.)
    const newIntervalFactor = frequencyMap[value]; // New frequency
  
    // ✅ Keep the same number of contributions, but adjust total duration in real time
    let totalPeriods = goalDuration * newIntervalFactor;
    let activeCarousel = goalDuration; // Maintain the number of savings contributions (40 weeks → 40 fortnights)
    let totalDaysNeeded = totalPeriods * (newIntervalFactor * 7); // Convert periods into total days
  
    setGoalDuration(totalPeriods);
    setScrollingWeek(activeCarousel);
    console.log('activeCarousel', activeCarousel);
  
    // ✅ Correctly update goal date based on new total duration
    const newGoalDate = new Date(startDate);
    newGoalDate.setDate(newGoalDate.getDate() + totalDaysNeeded);
    setGoalDate(
      new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(newGoalDate)
    );
  
    if (carouselRef.current) {
      carouselRef.current.scrollToWeek(activeCarousel); // Scroll using the same period count
    }
  
    setTimeout(() => {
      recurrenceJustChanged.current = false;
    }, 600);
    
    console.log('activeCarousel 2', activeCarousel);
  };
  
  
  
  
  

  const calculateAndSetGoalDate = (week) => {
    const newGoalDate = new Date(startDate);
    
    // Calculate the correct interval based on recurrence type
    if (savingRecurrence === 'monthly') {
        // For monthly, add months directly
        newGoalDate.setMonth(newGoalDate.getMonth() + week);
    } else {
        // For weekly and fortnightly, calculate days
        const intervalFactor = frequencyMap[savingRecurrence];
        const totalDays = week * intervalFactor * 7;
        newGoalDate.setDate(newGoalDate.getDate() + totalDays);
    }

    // Set the goal date immediately with the correct calculation
    setGoalDate(
        new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(newGoalDate)
    );

    const remainingAmount = savingsGoal - currentlySaved;
    if (remainingAmount > 0 && week > 0) {
        const calculatedSavingAmount = Math.ceil(remainingAmount / week);
        setUpdatedSavingAmount(calculatedSavingAmount);
    }
  };

  const handleScrollWeekChange = (week) => {

    const shouldSkipUpdate = lockScroll || isManualInput || recurrenceJustChanged.current;
    if (shouldSkipUpdate) {
        console.log('Skipping savings update - manual input or recurrence just changed');
        return;
    }

    setGoalDuration(week);
    setScrollingWeek(week);


    // Calculate and set the goal date
    calculateAndSetGoalDate(week);
  };
  
  

  
  const handleWeekChange = (week) => {
    
    if (lockScroll || isManualInput || recurrenceJustChanged.current) return;

    setGoalDuration(week);
    setScrollingWeek(week);

    // Calculate and set the goal date
    calculateAndSetGoalDate(week);console.log('goalDate handel week change 2', goalDate);
  };
  
  // useEffect(() => {
  //   if (!isManualInput && goalDuration > 0) {
  //     const remainingAmount = savingsGoal - currentlySaved;
  
  //     if (remainingAmount > 0) {
  //       const calculatedAmount = remainingAmount / goalDuration;
  //       setCalculatedSavingAmount(calculatedAmount); // For display
  //       setUpdatedSavingAmount(calculatedAmount); // Only update if not manually entered
  //     }

  //     console.log('Manual Input Active:', isManualInput);

  //   }
  // }, [goalDuration, isManualInput, savingsGoal, currentlySaved]);
  
  const handleSavingAmountChange = (text) => {
    const inputAmount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
  
    setIsManualInput(true); // ✅ Ensure manual input mode is active
    setUpdatedSavingAmount(inputAmount); // ✅ Store user-entered value
  
    const remainingAmount = savingsGoal - currentlySaved;
    if (inputAmount > 0) {
      const calculatedWeeks = Math.ceil(remainingAmount / inputAmount); // ✅ Calculate weeks dynamically
      setGoalDuration(calculatedWeeks); // ✅ Update goal duration
      setScrollingWeek(calculatedWeeks); // ✅ Sync carousel

      if (carouselRef.current) {
        carouselRef.current.scrollToWeek(calculatedWeeks);
      }
    }
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

  const remainingAmount = savingsGoal - currentlySaved; // Calculate remaining savings
  const weeksUntilGoal = remainingAmount > 0 ? Math.ceil(remainingAmount / savingAmount) : 0;

  const generatePayments = (startDate, savingAmount, frequency, weeksUntilGoal) => {
    const payments = [];
    let currentDate = new Date(startDate);
  
    for (let i = 0; i < weeksUntilGoal; i++) {
      payments.push({
        date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(currentDate),
        amount: savingAmount,
        totalAfter: currentlySaved + (savingAmount * (i + 1)), // Calculate total after payment
        type: "Deposit",  // Assume deposits only for now
        method: "Automatic", // Assume automatic for now
      });
  
      // Move date based on saving frequency
      currentDate.setDate(currentDate.getDate() + (frequency === "weekly" ? 7 : frequency === "fortnightly" ? 14 : 30));
    }
  
    return payments;
  };

  const handleNext = () => {
    const payments = generatePayments(startDate, updatedSavingAmount, savingRecurrence, weeksUntilGoal);
  
    navigation.navigate('NotificationsOnboarding', {
      savingsGoal,
      currentlySaved,
      goalDate,
      weeksUntilGoal,
      payments, // ✅ Pass generated payments
    });
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
              setScrollLock={setScrollLock}
              savingRecurrence={savingRecurrence} // Pass scrollLock setter
            />
          
          
          )}

        </View>

        <View style={styles.formContainer}>
          <View style={styles.rowGroup}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving amounts</Text>
              <TextInput
                style={styles.input}
                value={updatedSavingAmount ? `$${Math.ceil(updatedSavingAmount).toString()}` : ''} // ✅ Always show the manually entered value
                onChangeText={handleSavingAmountChange} // ✅ Allows manual edits
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
                onChange={(item) => handleSavingRecurrenceChange(item.value)}
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
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default DateSelectionScreen;