import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, PanResponder, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular, Lato_600SemiBold } from '@expo-google-fonts/lato';
import styles from './styles';

const LogoImg = require('./assets/Logo.png');

const Dashboard = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({
    RussoOne_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  const [goalData, setGoalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Upcoming");
  const payments = goalData?.payments || [];
  const [isScrolling, setIsScrolling] = useState(false);



  console.log("🚀 Goal Data at Render:", goalData);
  console.log("📜 All Payments in Goal Data:", goalData?.payments || "No payments found");
  

  // Separate upcoming and past payments
  const upcomingPayments = goalData?.payments?.filter(payment => {
    const paymentDate = new Date(payment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for correct comparison
    return paymentDate >= today;
  }) || [];
  
  const pastPayments = goalData?.payments?.filter(payment => {
    const paymentDate = new Date(payment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return paymentDate < today;
  }) || [];
  
  const filteredPayments = selectedTab === "Upcoming" ? upcomingPayments : pastPayments;
  
  console.log("🛠️ Filtered Payments:", filteredPayments);
  console.log("📅 Upcoming Payments:", upcomingPayments);
  console.log("📅 Past Payments:", pastPayments);
  
  

  useEffect(() => {
    const loadGoal = async () => {
      try {
        console.log("🔍 Checking AsyncStorage for saved goal...");
  
        if (route.params) {
          console.log("📌 Using goal data from navigation:", route.params);
          setGoalData(route.params);
          await AsyncStorage.setItem('savingsGoal', JSON.stringify(route.params));
        } else {
          console.log("📝 Fetching goal from AsyncStorage...");
          const savedGoal = await AsyncStorage.getItem('savingsGoal');
  
          if (savedGoal) {
            const parsedGoal = JSON.parse(savedGoal);
            console.log("✅ Goal loaded from AsyncStorage:", parsedGoal);
  
            if (!parsedGoal.payments) {
              parsedGoal.payments = []; // ✅ Ensure payments exist
            }
  
            setGoalData(parsedGoal);
          } else {
            console.log("⚠ No saved goal found in AsyncStorage!");
          }
        }
      } catch (error) {
        console.error("❌ Error loading goal from AsyncStorage:", error);
      } finally {
        console.log("✅ Finished loading goal.");
        setIsLoading(false);
      }
    };
  
    loadGoal();
  }, []);
  

  const screenHeight = Dimensions.get('window').height;
  const collapsedPosition = screenHeight - 200; // ✅ Tray sits 300px from the bottom
  const expandedPosition = screenHeight - 700; // ✅ Tray moves up to 700px from the bottom
  
  const animatedValue = useRef(new Animated.Value(collapsedPosition)).current;
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (isScrolling) return false; // ✅ Completely block tray movement when scrolling
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) return false; // ✅ Ignore horizontal swipes
        return Math.abs(gestureState.dy) > 10; // ✅ Only trigger if significant vertical movement
      },
      onStartShouldSetPanResponder: () => !isScrolling, // ✅ Prevents pan start when scrolling
      onPanResponderMove: (e, gestureState) => {
        if (!isScrolling) {
          const newValue = animatedValue._value - gestureState.dy;
          if (newValue >= expandedPosition && newValue <= collapsedPosition) {
            animatedValue.setValue(newValue);
          }
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (!isScrolling) {
          if (gestureState.dy > 50) {
            Animated.spring(animatedValue, { toValue: collapsedPosition, useNativeDriver: false }).start();
            setIsTrayExpanded(false);
          } else if (gestureState.dy < -50) {
            Animated.spring(animatedValue, { toValue: expandedPosition, useNativeDriver: false }).start();
            setIsTrayExpanded(true);
          }
        }
      },
    })
  ).current;
  


  if (isLoading || !fontsLoaded) {
    console.log("⏳ Waiting for data to load...");
    return <Text>Loading...</Text>;
  }

  console.log("🚀 Final goalData state:", goalData);
  console.log("🔤 Fonts Loaded:", fontsLoaded);

  const resetGoal = async () => {
    try {
      await AsyncStorage.removeItem('savingsGoal'); // 🗑 Clear stored goal
      console.log("🔄 Goal reset. Redirecting to SavingsGoalScreen...");
      navigation.replace('SavingsGoal'); // 🚀 Send user back to setup
    } catch (error) {
      console.error("❌ Error resetting goal:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Image style={styles.LogoImg} source={LogoImg} />
        <Text style={styles.title}>SavingsHero</Text>
      </View>
      <Text style={styles.goalTextWeeks}>{goalData?.weeksUntilGoal ?? 'N/A'} weeks to go!</Text>
      <Text style={styles.goalText}>
        You’ll hit your goal by <Text style={{ color: '#9913FF', fontWeight: 'bold' }}>{goalData?.goalDate}</Text>
      </Text>
      <TouchableOpacity onPress={resetGoal} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset Goal</Text>
      </TouchableOpacity> 
      <Animated.View {...panResponder.panHandlers} style={[styles.tray, { transform: [{ translateY: animatedValue }] }]}>
      <View style={styles.trayHandle} />
    {/* Payments Header with Amount Left */}
    <View style={styles.trayHeader}>
      <Text style={styles.trayHeading}>Payments</Text>
      <Text style={styles.amountLeft}>
        ${goalData?.currentlySaved ?? 0} 
        <Text style={styles.totalAmount}> / {goalData?.savingsGoal ?? 0}</Text>
      </Text>
    </View>

    {/* Tabs for Upcoming / Past */}
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, selectedTab === "Upcoming" && styles.activeTab]} 
        onPress={() => setSelectedTab("Upcoming")}
      >
        <Text style={[styles.tabText, selectedTab === "Upcoming" && styles.activeTabText]}>Upcoming</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, selectedTab === "Past" && styles.activeTab]} 
        onPress={() => setSelectedTab("Past")}
      >
        <Text style={[styles.tabText, selectedTab === "Past" && styles.activeTabText]}>Past</Text>
      </TouchableOpacity>
    </View>

    {/* Payment List */}
    <ScrollView 
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} 
  style={styles.paymentList} 
  nestedScrollEnabled={true} 
  scrollEventThrottle={16} 
  onScrollBeginDrag={() => setIsScrolling(true)} // ✅ Disables tray movement when scrolling starts
  onMomentumScrollEnd={() => setTimeout(() => setIsScrolling(false), 100)} // ✅ Re-enables tray after scrolling stops
  onScrollEndDrag={() => setTimeout(() => setIsScrolling(false), 100)} // ✅ Ensures smooth transition
>


      {goalData?.payments?.length > 0 ? (
        goalData.payments.map((payment, index) => (
          <View key={index}>
            {/* Payment Date */}
            <Text style={styles.paymentDate}>{payment.date}</Text>

            {/* Payment Card */}
            <View style={styles.paymentCard}>
              {/* Icon for Deposit (+) or Withdrawal (-) */}
              <Text style={[styles.paymentIcon, payment.type === "Deposit" ? styles.depositIcon : styles.withdrawalIcon]}>
                {payment.type === "Deposit" ? "+" : "-"}
              </Text>

              {/* Payment Details */}
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>${payment.amount}</Text>
                <Text style={styles.paymentTotal}>Total: ${payment.totalAfter}</Text>
                <Text style={styles.paymentType}>{payment.type} • {payment.method}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noPaymentsText}>No payments found</Text>
      )}
    </ScrollView>


  </Animated.View>
    </View>
  );
};

export default Dashboard;
