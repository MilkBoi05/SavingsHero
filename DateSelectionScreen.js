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
  const [goalDuration, setGoalDuration] = useState(0); // number of periods (weeks, fortnights, or months)
  const [displayDuration, setDisplayDuration] = useState('1');
  const [scrollingWeek, setScrollingWeek] = useState(0);
  const [updatedSavingAmount, setUpdatedSavingAmount] = useState(savingAmount);
  const [motivation, setMotivation] = useState('');
  const [savingRecurrence, setSavingRecurrence] = useState(frequency);
  const recurrenceJustChanged = useRef(false);
  const debounceTimer = useRef(null);
  const [isManualInput, setIsManualInput] = useState(false);
  const [calculatedSavingAmount, setCalculatedSavingAmount] = useState(savingAmount);
  const [lockScroll, setScrollLock] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const generateDataArray = (recurrence) => {
    switch (recurrence) {
      case "weekly":
        return Array.from({ length: 52000 }, (_, i) => i + 1);
      case "fortnightly":
        return Array.from({ length: 52000 }, (_, i) => i + 1);
      case "monthly":
        return Array.from({ length: 52000 }, (_, i) => i + 1);
      default:
        return Array.from({ length: 52000 }, (_, i) => i + 1);
    }
  };

  const [weeks, setWeeks] = useState(generateDataArray(savingRecurrence));

  // ─── HELPER FUNCTIONS FOR GOAL DATE CALCULATION ───────────────────────────────
  // Computes a new date by adding the correct number of days/months based on recurrence.
  const computeGoalDate = (baseDate, periods, recurrence) => {
    const date = new Date(baseDate);
    switch (recurrence) {
      case 'fortnightly':
        date.setDate(date.getDate() + periods * 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + periods);
        break;
      case 'weekly':
      default:
        date.setDate(date.getDate() + periods * 7);
        break;
    }
    console.log('Goal date compute goal date', date);
    return date;
  };

  // Updates the goal date and recalculates the saving amount based on the current period count.
  const updateGoalDate = (periods) => {
    const newDate = computeGoalDate(startDate, periods, savingRecurrence);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(newDate);
    setGoalDate(formattedDate);
    const remainingAmount = savingsGoal - currentlySaved;
    if (remainingAmount > 0 && periods > 0) {
      const newSavingAmt = Math.ceil(remainingAmount / periods);
      setUpdatedSavingAmount(newSavingAmt);
    }
    console.log('Periods', periods);
    console.log('Goal date update goal date', goalDate);
    console.log('New date update goal date', newDate);
    console.log('Formatted date update goal date', formattedDate);


  };


  // ─── DURATION DISPLAY LOGIC ────────────────────────────────────────────────────
  const formatDuration = (periods) => {
    const weeksPerPeriod = {
      weekly: 1,
      fortnightly: 2,
      monthly: 4.33
    };
    const totalWeeks = periods * (weeksPerPeriod[savingRecurrence] || 1);

    if (savingRecurrence === 'monthly' && periods < 12) {
      return `${periods} month${periods === 1 ? '' : 's'}`;
    } else if (savingRecurrence === 'fortnightly' && periods < 26) {
      return `${periods} fortnight${periods === 1 ? '' : 's'}`;
    } else if (totalWeeks < 16) {
      return `${Math.round(totalWeeks)} week${totalWeeks === 1 ? '' : 's'}`;
    }

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

  // ─── INITIALIZATION: CALCULATE INITIAL GOAL DATE & DURATION ────────────────
  useEffect(() => {
    const calculateInitialDetails = () => {
      const remainingAmount = savingsGoal - currentlySaved;
      if (remainingAmount <= 0) {
        setGoalDate('Goal Achieved!');
        setGoalDuration(0);
        setScrollingWeek(0);
        return;
      }
      const periodsRequired = Math.ceil(remainingAmount / updatedSavingAmount);
      setGoalDuration(periodsRequired);
      setScrollingWeek(periodsRequired);
      updateGoalDate(periodsRequired);
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollToWeek(periodsRequired);
        }
      }, 100);
      console.log('Running calculateInitialDetails');
      console.log('Goal date initial details', goalDate);
    };
    calculateInitialDetails();
  }, [savingsGoal, savingAmount, frequency, currentlySaved, savingRecurrence]);


  // ─── EVENT HANDLERS ─────────────────────────────────────────────────────────────
  // When the user changes the saving recurrence (weekly, fortnightly, monthly)
  const handleSavingRecurrenceChange = (value) => {
    recurrenceJustChanged.current = true;
    setSavingRecurrence(value);
    setWeeks(generateDataArray(value));
    // Recalculate the goal date using the current period count
    updateGoalDate(goalDuration);
    if (carouselRef.current) {
      carouselRef.current.scrollToWeek(goalDuration);
    }
    setTimeout(() => {
      recurrenceJustChanged.current = false;
    }, 600);
    console.log('Running handleSavingRecurrenceChange');
    console.log('Goal date saving recurrence change', goalDate);
  };

  // Called during scrolling to immediately update the goal date
  const handleScrollWeekChange = (week) => {
    if (lockScroll || isManualInput || recurrenceJustChanged.current) return;
    setGoalDuration(week);
    setScrollingWeek(week);
    updateGoalDate(week);
    console.log('Running handleScrollWeekChange');
    console.log('Goal date scroll week change', goalDate);
  };


  // Finalizes updates after scrolling stops
  const handleWeekChange = (week) => {
    if (lockScroll || isManualInput || recurrenceJustChanged.current) return;
    setGoalDuration(week);
    setScrollingWeek(week);
    updateGoalDate(week);
    console.log('Running handleWeekChange');
    console.log('Goal date week change', goalDate);
  };


  // Handle manual input of saving amount and recalc duration/goal date accordingly
  const handleSavingAmountChange = (text) => {
    const inputAmount = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    setIsManualInput(true);
    setUpdatedSavingAmount(inputAmount);
    const remainingAmount = savingsGoal - currentlySaved;
    if (inputAmount > 0) {
      const calculatedPeriods = Math.ceil(remainingAmount / inputAmount);
      setGoalDuration(calculatedPeriods);
      setScrollingWeek(calculatedPeriods);
      updateGoalDate(calculatedPeriods);
      if (carouselRef.current) {
        carouselRef.current.scrollToWeek(calculatedPeriods);
      }
    }
  };

  const calculateMonthsAndWeeks = (startDate, goalDate) => {
    const start = new Date(startDate);
    const goal = new Date(goalDate);
    let months = 0;
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
    const remainingDays = Math.round((goal - start) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(remainingDays / 7);
    return { months, weeks };
  };

  // ─── IMAGE HANDLING ────────────────────────────────────────────────────────────
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
      setUploadedImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // ─── PAYMENT GENERATION & NAVIGATION ───────────────────────────────────────────
  const remainingAmount = savingsGoal - currentlySaved;
  const weeksUntilGoal = remainingAmount > 0 ? Math.ceil(remainingAmount / savingAmount) : 0;

  const generatePayments = (startDate, savingAmount, frequency, weeksUntilGoal) => {
    const payments = [];
    let currentDate = new Date(startDate);
    for (let i = 0; i < weeksUntilGoal; i++) {
      payments.push({
        date: new Intl.DateTimeFormat('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }).format(currentDate),
        amount: savingAmount,
        totalAfter: currentlySaved + (savingAmount * (i + 1)),
        type: "Deposit",
        method: "Automatic",
      });
      switch (frequency) {
        case 'fortnightly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'weekly':
        default:
          currentDate.setDate(currentDate.getDate() + 7);
          break;
      }
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
      payments,
    });
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <ScrollView bounces={false}>
        <View style={styles.dateHeader}>
          <Text style={styles.headerText}>
            At that rate, you will achieve your savings goal by...
          </Text>
          <View style={styles.goalDateContainer}>
            <Text style={styles.goalDate}>{goalDate}</Text>
            <Text style={styles.goalDuration}>{formatDuration(goalDuration)}</Text>
          </View>
          {goalDuration > 0 && (
            <WeeksCarousel
              ref={carouselRef}
              data={weeks}
              selectedWeek={goalDuration}
              onScrollWeekChange={handleScrollWeekChange}
              onWeekChange={handleWeekChange}
              lockScroll={lockScroll}
              setScrollLock={setScrollLock}
              savingRecurrence={savingRecurrence}
            />
          )}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.rowGroup}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Saving amount</Text>
              <TextInput
                style={styles.input}
                value={updatedSavingAmount ? `$${Math.ceil(updatedSavingAmount).toString()}` : ''}
                onChangeText={handleSavingAmountChange}
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
