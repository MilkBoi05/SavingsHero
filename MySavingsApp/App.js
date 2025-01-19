// Import required libraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const SavingsGoalScreen = () => {
  const [goalType, setGoalType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goalTypes = [
    { label: 'New Car', value: 'car' },
    { label: 'House Deposit', value: 'house' },
    { label: 'Vacation', value: 'vacation' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => {}} />
        <Text style={styles.title}>SavingsHero</Text>
        <IconButton icon="account" size={24} onPress={() => {}} />
      </View>

      <Text style={styles.heading}>Hello! Let’s create your first savings goal.</Text>

      <View style={styles.formGroup}>
        <TextInput style={styles.input} placeholder="Goal name (e.g., New car, house deposit)" />
        <Dropdown
          style={styles.dropdown}
          data={goalTypes}
          labelField="label"
          valueField="value"
          placeholder="Select goal type"
          value={goalType}
          onChange={(item) => setGoalType(item.value)}
        />
        <TextInput style={styles.input} placeholder="Goal amount ($)" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Saving amount ($)" keyboardType="numeric" />

        <Dropdown
          style={styles.dropdown}
          data={[{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]}
          labelField="label"
          valueField="value"
          placeholder="Saving recurrence"
        />

        <View style={styles.toggleGroup}>
          <TouchableOpacity style={styles.toggleButtonSelected}>
            <Text style={styles.toggleText}>Automatically</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleText}>Manually</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text>{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        <TextInput style={styles.input} placeholder="Currently saved ($)" keyboardType="numeric" />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#4A4A4A' },
  heading: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  formGroup: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleGroup: { flexDirection: 'row', marginBottom: 16 },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonSelected: {
    flex: 1,
    padding: 12,
    backgroundColor: '#D0A8F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: { fontSize: 16, fontWeight: 'bold' },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  skipButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#7B42F8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default SavingsGoalScreen;
