import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {  backgroundColor: '#fff'
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8, marginTop: 12},
  title: { 
    fontFamily: 'RussoOne_400Regular', fontSize: 24, fontWeight: 'bold', color: '#4A4A4A', marginTop: 44 },
  introSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  introImage: { width: 160, height: 160, marginLeft: -8 },
  LogoImg: {width:28, height:40, marginTop: 44,},
  heading: {
    fontFamily: 'Lato_700Bold', // Lato for mobile
    fontSize: 32,
    color: "#434343",
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '62%',
    alignSelf: 'center',
  },
  formGroup: { 
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150, // Leave space for the fixed buttons at the bottom
  },
  label: {
    fontFamily: 'Lato_700Bold', // Lato for mobile
    fontSize: 14,
    color: '#434343',
    marginBottom: 4,
  },
  bottomLabel: {
    marginBottom: 12,
    paddingBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    placeholderTextColor: '#8E9AA5',
    color: "#434343"
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize:16,
    color: "#898989"
  },
  placeholderStyle: {
    color: '#8E9AA5', // Set placeholder color
    fontSize: 16,  // Set placeholder font size
  },
  itemTextStyle: {
    fontSize: 12,  // Font size for dropdown items
    color: '#000', // Text color for items
  },
  rowGroup: { flexDirection: 'row', gap: 8, },
  twoThirdsInput: { flex: 2,},
  oneThirdInput: { flex: 1 },
  halfInput: { flex: 1 },
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
    paddingLeft: 12,
    marginBottom: 16,
    backgroundColor: "transparent"
  },
  dateText:{
    fontSize: 16,
  },
  calendarIcon: { 
    marginLeft: -8, 
  },
  buttonGroup: { 
    position: 'absolute', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    height:80,
    marginTop: 36,
    bottom: 0,
    left: 16,
    right: 16,
    paddingBottom: 20
    },
  skipButton: {
    flex: 1,
    marginRight: 0,
    backgroundColor: '#fff',
    padding: 19,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipButtonText: { color: '#A23DEF', fontWeight: 'bold', fontSize: 16 },
  nextButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#A23DEF',
    padding: 19,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  section: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 3,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  toggleButtonGroup: {
    flexDirection: 'row',
    position: 'relative',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dateButton: {
    color: '#434343',
    backgroundColor: "red",
    buttonTextColorIOS: 'red'
  },
  openModalButtonText: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    placeholderTextColor: '#8E9AA5'
  },
  slider: {
    position: 'absolute',
    width: '50%', // Half the width of the toggle group
    height: '100%',
    backgroundColor: '#F3E3FF',
    borderRadius: 8,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure text is above the sliding background
  },
  toggleText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  toggleTextSelected: {
    color: '#a23def', // White text for selected option
  },
  buffer: {
    height: 50, // Adjust this as needed
  },
});

export default styles;
