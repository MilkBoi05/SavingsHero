import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

// Import the WebViewMoneyJar component
import WebViewMoneyJar from './WebViewMoneyJar';

// This wrapper component will handle platform-specific rendering
const MoneyJarWrapper = () => {
  // Check if we're on web platform
  const isWeb = Platform.OS === 'web';
  
  // Log platform information for debugging
  useEffect(() => {
    console.log("MoneyJarWrapper: Running on platform:", Platform.OS);
    console.log("MoneyJarWrapper: Platform version:", Platform.Version);
  }, []);
  
  if (isWeb) {
    // For web, we'll use a simpler approach to avoid bundling issues
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          3D Money Jar (Web view not supported)
        </Text>
        <Text style={styles.subtitle}>
          Please use the mobile app for the full experience
        </Text>
      </View>
    );
  }
  
  // For mobile platforms, render the WebViewMoneyJar component
  return (
    <View style={styles.container}>
      <WebViewMoneyJar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});

export default MoneyJarWrapper; 