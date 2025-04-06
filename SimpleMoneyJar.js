import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

// Simple MoneyJar component that uses an image instead of 3D rendering
const SimpleMoneyJar = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    // Handle dimension changes
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.jarContainer}>
        <View style={styles.jarImage}>
          <Text style={styles.jarText}>💰</Text>
        </View>
      </View>
      <Text style={styles.label}>Your Savings Jar</Text>
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
  jarContainer: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jarImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#ddd',
  },
  jarText: {
    fontSize: 80,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SimpleMoneyJar; 