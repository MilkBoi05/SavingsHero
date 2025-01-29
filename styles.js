import { StyleSheet, Platform } from 'react-native';
import { Merriweather_700Bold, Merriweather_900Black } from '@expo-google-fonts/merriweather';

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
  dateHeader: {
    backgroundColor: "#A23DEF",
    padding: 16,
    alignItems: 'center',
    paddingTop: 72,
    gap:24,
    paddingBottom: 24
  },
  dashboardHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8, 
    gap: 8,
    marginTop: 16,
    paddingLeft: 16
  },
  goalDateContainer: {
     alignItems: 'center',
     gap: 12
  },
  formContainer: {
    padding: 16,
  },
  headerText: {
    fontFamily: 'Lato_700Bold',
    fontSize:22,
    color: 'white',
    textAlign: 'center',
    width: 300
  },
  goalDate: {
    fontFamily: 'Merriweather_900Black',
    color: 'white',
    fontSize: 34
  },
  goalDuration: {
    fontFamily: 'Merriweather_700Bold',
    color: 'white',
    fontSize: 20
  },
  adjustmentButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  adjustButton: {
    color: 434343,
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    width: 86,
    alignItems: 'center'
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
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    placeholderTextColor: '#B2B7C3',
    color: "#434343",
    height: 96
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
  imageUploadButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 120,
    width: 120,
    justifyContent: 'center', // Aligns vertically (top, center, or bottom)
    alignItems: 'center',
    borderStyle: 'dashed', 
    
  },
  imageUploadText: {
    fontSize: 32,
    color: '#B2B7C3'
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
  sliderContainer: {
    height: 100,
    backgroundColor: '#1FA849', // Green background
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectedTick: {
    height: 60,
  },
  tickText: {
    fontSize: 12,
  },
  selectedTickText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  defaultTickText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -24,
    marginBottom: 24
  },
  imageUploadContainer: {
    flexDirection: 'row',
    gap: 12
  },
  // imageUploadButton: {
  //   backgroundColor: '#007BFF',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginRight: 10,
  // },
  // imageUploadText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  removeButton: {
    position: 'absolute',
    top: 0, // Add some padding from the top edge
    right: 0, // Add some padding from the right edge
    backgroundColor: '#fff',
    width: 30, // Slightly larger button for usability
    height: 30,
    borderRadius: 100, // Make it circular
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3, // Ensure it appears above the image,
  },
  removeButtonText: {
    fontSize: 24
  },
  NotificationHeading: {
    fontFamily: 'Lato_700Bold',
    fontSize:24,
    color: '#434343',
    marginTop: 48,
    marginBottom: 24

  },
  optionStack: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 0,
    marginBottom: 24,
    fontSize: 16,
    placeholderTextColor: '#8E9AA5',
    color: "#434343"
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    borderRadius: 8,
    fontSize: 16,
    placeholderTextColor: '#8E9AA5',
    color: "#434343"
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    placeholderTextColor: '#8E9AA5',
    color: "#434343"
  },
  optionWrapper: {
    width: '100%',
  },
  tray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
  },
  trayHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  trayHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  goalTextWeeks: {
    paddingLeft: 16,
    fontFamily: 'Lato_700Bold',
    fontSize: 28
  },
  goalText: {
    paddingLeft: 16,
    fontFamily: 'Lato_700Bold',
    fontSize: 20
  },
  goalTextDates: {
    paddingLeft: 16,
    fontFamily: 'Lato_700Bold',
    fontSize: 20
  },amountLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', 
  },
  
  totalAmount: {
    color: '#888',  // Lighter text for the total amount
  },
  
  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#A23DEF',
  },
  
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  
  activeTabText: {
    color: '#A23DEF',
    fontWeight: 'bold',
  },
  
  paymentList: {
    maxHeight: 200,
  },
  
  paymentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  paymentIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  
  depositIcon: {
    color: '#1FA849',
  },
  
  withdrawalIcon: {
    color: '#FF5733',
  },
  trayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

export default styles;
