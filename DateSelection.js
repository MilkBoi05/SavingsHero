// DateSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import styles from './styles';

const DateSelectionScreen = ({ navigation }) => {
  const [savingAmount, setSavingAmount] = useState('$250');
  const [motivation, setMotivation] = useState('');
  const [savingRecurrence, setSavingRecurrence] = useState('Weekly');

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.headerText}>
          At that rate, you will achieve your savings goal by...
        </Text>
        <Text style={styles.goalDate}>11 November 2026</Text>
        <Text style={styles.goalDuration}>48 weeks</Text>
        <View style={styles.adjustmentButtons}>
          <TouchableOpacity style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>- 1 month</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>- 1 week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>+ 1 week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>+ 1 month</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.rowGroup}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Saving amount</Text>
            <TextInput
              style={styles.input}
              value={savingAmount}
              onChangeText={setSavingAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Saving recurrence</Text>
            <TextInput
              style={styles.input}
              value={savingRecurrence}
              onChangeText={setSavingRecurrence}
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
          <TouchableOpacity style={styles.imageUploadButton}>
            <Text style={styles.imageUploadText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('NextPage')}
        >
          <Text style={styles.nextButtonText}>Next (2/3)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8E6',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  goalDate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  goalDuration: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  adjustmentButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  adjustButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  adjustButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#434343',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    height: 80,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imageUploadButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 32,
    color: '#CCCCCC',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  backButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
*/
export default DateSelectionScreen;
