import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';
import styles from './styles';

const LogoImg = require('./assets/Logo.png');

const Dashboard = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({ RussoOne_400Regular, Lato_700Bold, Lato_400Regular });
  const [goalData, setGoalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const [isScrolling, setIsScrolling] = useState(false);
  
  const screenHeight = Dimensions.get('window').height;
  const collapsedPosition = screenHeight - 300;
  const expandedPosition = screenHeight - 700;
  
  const animatedValue = useRef(new Animated.Value(collapsedPosition)).current;
  const lastPosition = useRef(collapsedPosition);
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);

  useEffect(() => {
    const loadGoal = async () => {
      try {
        if (route.params) {
          setGoalData(route.params);
          await AsyncStorage.setItem('savingsGoal', JSON.stringify(route.params));
        } else {
          const savedGoal = await AsyncStorage.getItem('savingsGoal');
          if (savedGoal) {
            setGoalData(JSON.parse(savedGoal));
          }
        }
      } catch (error) {
        console.error("Error loading goal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGoal();
  }, []);

  const handleGestureEnd = (event) => {
    const { velocityY, translationY, state } = event.nativeEvent;
    if (state !== State.END) return;
    
    let newValue = velocityY < 0 ? expandedPosition : collapsedPosition;

    Animated.spring(animatedValue, {
      toValue: newValue,
      velocity: velocityY,
      damping: 30,
      useNativeDriver: false,
    }).start(() => {
      lastPosition.current = newValue;
    });

    setIsTrayExpanded(newValue === expandedPosition);
  };

  if (isLoading || !fontsLoaded) return <Text>Loading...</Text>;

  const today = new Date();
today.setHours(0, 0, 0, 0); // Ensure today's time is set to midnight

let upcomingPayments = [];
let pastPayments = [];

// Define month mapping manually
const monthMap = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
};

goalData?.payments?.forEach((payment) => {
  if (!payment.date) return; // Skip if date is missing

  // Extract month, day, and year from "January 29, 2025" format
  const dateRegex = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/;
  const match = payment.date.match(dateRegex);

  if (!match) {
    console.warn(`Invalid date format: ${payment.date}`);
    return; // Skip this entry if it doesn’t match expected format
  }

  const [, monthName, day, year] = match; // Extract parts
  const month = monthMap[monthName]; // Convert month name to number safely

  if (month === undefined) {
    console.error(`Unrecognized month: ${monthName} in date: ${payment.date}`);
    return; // Prevent crashing if an invalid month is found
  }

  const parsedDate = new Date(year, month, parseInt(day, 10));
  parsedDate.setHours(0, 0, 0, 0); // Normalize time

  // Categorize correctly
  if (parsedDate >= today) {
    upcomingPayments.push(payment);
  } else {
    pastPayments.push(payment);
  }

  console.log(`Raw: ${payment.date} | Parsed: ${parsedDate.toISOString()} | Today: ${today.toISOString()}`);
});

// Ensure the selected tab shows the correct payments
const filteredPayments = selectedTab === "Upcoming" ? upcomingPayments : pastPayments;

const resetGoal = async () => {
  try {
    await AsyncStorage.removeItem('savingsGoal'); // 🗑 Clear stored goal
    console.log("🔄 Goal reset. Redirecting to SavingsGoalScreen...");
    navigation.replace('SavingsGoal'); // 🚀 Send user back to setup
  } catch (error) {
    console.error("❌ Error resetting goal:", error);
  }
};  


  console.log("Today's date:", today);
console.log("Raw payments data:", goalData?.payments);


  return (
    <View style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Image style={styles.LogoImg} source={LogoImg} />
        <Text style={styles.title}>SavingsHero</Text>
      </View>
      <Text style={styles.goalTextWeeks}>{goalData?.weeksUntilGoal ?? 'N/A'} weeks to go!</Text>
      <Text style={styles.goalText}>You’ll hit your goal by <Text style={{ color: '#9913FF', fontWeight: 'bold' }}>{goalData?.goalDate}</Text></Text>
      <TouchableOpacity 
  onPress={resetGoal} // Calls the new function
  style={styles.resetButton}
>
  <Text style={styles.resetButtonText}>Reset Goal</Text>
  <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
</TouchableOpacity>
      <PanGestureHandler onHandlerStateChange={handleGestureEnd}>
        <Animated.View style={[styles.tray, { transform: [{ translateY: animatedValue }] }]}> 
          <View style={styles.trayHandle} />
          <View style={styles.trayHeader}>
            <Text style={styles.trayHeading}>Payments</Text>
            <Text style={styles.amountLeft}>${goalData?.currentlySaved ?? 0} / {goalData?.savingsGoal ?? 0}</Text>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setSelectedTab("Upcoming")} style={[styles.tab, selectedTab === "Upcoming" && styles.activeTab]}>
              <Text style={[styles.tabText, selectedTab === "Upcoming" && styles.activeTabText]}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab("Past")} style={[styles.tab, selectedTab === "Past" && styles.activeTab]}>
              <Text style={[styles.tabText, selectedTab === "Past" && styles.activeTabText]}>Past</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, minHeight: 600, paddingBottom: 100 }} // Ensures a minimum height
  style={styles.paymentList}
  nestedScrollEnabled={true}
  scrollEventThrottle={16}
  onScrollBeginDrag={() => setIsScrolling(true)}
  onMomentumScrollEnd={() => setTimeout(() => setIsScrolling(false), 100)}
  onScrollEndDrag={() => setTimeout(() => setIsScrolling(false), 100)}
>

            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <View key={index}>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                  <View style={styles.paymentCard}>
                    <Text style={[styles.paymentIcon, { color: '#9913FF', padding: 8 }]}> 
                      {payment.type === "Deposit" ? "+" : "-"}
                    </Text>
                    <View style={styles.paymentDetails}>
                      <Text style={styles.paymentAmount}>${payment.amount}</Text>
                      <Text style={styles.paymentTotal}>Total: ${payment.totalAfter}</Text>
                    </View>
                    <View style={styles.paymentTypeContainer}>
                      <Text style={styles.paymentType}>{payment.type}</Text>
                      <Text style={styles.paymentMethod}>{payment.method}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noPaymentsText}>No payments found</Text>
            )}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Dashboard;
