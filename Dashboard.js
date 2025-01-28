import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';
import styles from './styles';
import { useFonts } from 'expo-font';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { Lato_700Bold, Lato_400Regular } from '@expo-google-fonts/lato';

const LogoImg = require('./assets/Logo.png');

const Dashboard = ({ route }) => {
    const { goalDuration, weeksUntilGoal, savingsGoal, currentlySaved, goalDate } = route.params || {}; // Ensure defaults
  
    const [fontsLoaded] = useFonts({
      RussoOne_400Regular,
      Lato_400Regular,
      Lato_700Bold,
    });
  
    // Utility function to reformat the goalDate
    const formatGoalDate = (dateString) => {
      if (!dateString) return 'Invalid Date'; // Handle null/undefined
  
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date'; // Check if valid date
  
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
  
      // Adding "th", "st", "nd", or "rd" to the day
      const day = date.getDate();
      let suffix = 'th';
      if (day % 10 === 1 && day !== 11) suffix = 'st';
      else if (day % 10 === 2 && day !== 12) suffix = 'nd';
      else if (day % 10 === 3 && day !== 13) suffix = 'rd';
  
      return formattedDate.replace(/\d+/, `${day}${suffix}`);
    };
  
    const formattedGoalDate = formatGoalDate(goalDate);
  
    console.log('Goal date:', goalDate); // Debugging
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.LogoImg} source={LogoImg} />
          <Text style={styles.title}>SavingsHero</Text>
        </View>
        <Text style={styles.goalText}>{weeksUntilGoal} weeks to go!</Text>
        <Text style={styles.goalText}>
          You’ll hit your goal by {formattedGoalDate}.
        </Text>
        <View style={styles.tray}>
          <Text style={styles.trayHeading}>Payments</Text>
          <Text style={styles.paymentInfo}>Goal Duration: {goalDuration} weeks</Text>
          <Text style={styles.paymentInfo}>
            Weeks Remaining: {weeksUntilGoal} weeks
          </Text>
        </View>
      </View>
    );
  };
  

export default Dashboard;
