// Import required libraries
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const SavingsGoalScreen = () => {
  const [goalType, setGoalType] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentType, setPaymentType] = useState('Automatically');

  const goalTypes = [
    { label: 'New Car', value: 'car' },
    { label: 'House Deposit', value: 'house' },
    { label: 'Vacation', value: 'vacation' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SavingsHero</Text>
      </View>

      <View style={styles.introSection}>
        <Text style={styles.heading}>Hello! Let’s create your first savings goal.</Text>
        <Image style={styles.placeholderImage} source={{ uri: 'https://via.placeholder.com/150' }} />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.rowGroup}>
          <View style={styles.twoThirdsInput}>
            <Text style={styles.label}>Goal name</Text>
            <TextInput style={styles.input} placeholder="e.g., New car, house deposit" />
          </View>
          <View style={styles.oneThirdInput}>
            <Text style={styles.label}>Goal type</Text>
            <Dropdown
              style={styles.dropdown}
              data={goalTypes}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={goalType}
              onChange={(item) => setGoalType(item.value)}
            />
          </View>
        </View>

        <Text style={styles.label}>Goal amount</Text>
        <TextInput style={styles.input} placeholder="$0" keyboardType="numeric" />

        <Text style={styles.label}>Saving amount</Text>
        <TextInput style={styles.input} placeholder="$0" keyboardType="numeric" />

        <Text style={styles.label}>Saving recurrence</Text>
        <Dropdown
          style={styles.dropdown}
          data={[{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]}
          labelField="label"
          valueField="value"
          placeholder="Select recurrence"
        />

        <Text style={styles.label}>Add payments to goal</Text>
        <View style={styles.toggleButtonGroup}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              paymentType === 'Automatically' && styles.toggleButtonSelected,
            ]}
            onPress={() => setPaymentType('Automatically')}
          >
            <Text style={styles.toggleText}>Automatically</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              paymentType === 'Manually' && styles.toggleButtonSelected,
            ]}
            onPress={() => setPaymentType('Manually')}
          >
            <Text style={styles.toggleText}>Manually</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Start date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text>{startDate.toLocaleDateString()}</Text>
          <IconButton icon="calendar" size={20} style={styles.calendarIcon} />
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

        <Text style={styles.label}>Currently saved</Text>
        <TextInput style={styles.input} placeholder="$0" keyboardType="numeric" />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#4A4A4A' },
  introSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  placeholderImage: { width: 50, height: 50, marginLeft: 8 },
  heading: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
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
  rowGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  twoThirdsInput: { flex: 2, marginRight: 12 },
  oneThirdInput: { flex: 1 },
  toggleButtonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#f9f9f9',
  },
  toggleButtonSelected: {
    backgroundColor: '#D0A8F3',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  calendarIcon: { marginLeft: 8 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
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
