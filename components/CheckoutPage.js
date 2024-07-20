import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Platform, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Back from '../assets/icons/go-back-svgrepo-com.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useColorScheme } from 'react-native';

const CheckoutPage = () => {
  const navigation = useNavigation();
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropDate, setDropDate] = useState(new Date());
  const [passengers, setPassengers] = useState('');
  const [dropLocation, setDropLocation] = useState('No Location Selected');
  const [pickupLocation, setPickupLocation] = useState('No Location Selected');
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('pickup');
  const colorScheme = useColorScheme();
  const [rideData, setRideData] = useState({
    passengers: null,
    pickupDateTime: null,
    dropDateTime: null,
  });

  useEffect(() => {
    // Load rideData from AsyncStorage when the component mounts
    loadRideData();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveRideData = async (data) => {
    try {
      await AsyncStorage.setItem('rideData', JSON.stringify(data));
      const allData = await getAllDataInStorage(); // Wait for the result
      console.log('AsyncStorage updated:', allData);
    } catch (error) {
      console.error('Error saving ride data:', error);
    }
  };

  const loadRideData = async () => {
    try {
      const data = await AsyncStorage.getItem('rideData');
      if (data) {
        const parsedData = JSON.parse(data);
        setRideData(parsedData);
        // Update passengers and dropLocation states
        setPassengers(parsedData.passengers ? String(parsedData.passengers) : '');
        setDropLocation(parsedData.destination_address || 'No Location Selected');
        setPickupLocation(parsedData.current_address || 'No Location Selected');
      }
    } catch (error) {
      console.error('Error loading ride data:', error);
    }
  };

  const getAllDataInStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      return data.map(([key, value]) => ({ [key]: JSON.parse(value) }));
    } catch (error) {
      console.error('Error getting data from AsyncStorage:', error);
      return null;
    }
  };

  const handleLocationPickerPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleScheduleRide = async () => {
    // Calculate drop date and time based on pickup date (assuming a fixed duration for the ride)
    const rideDurationInHours = 2; // Example: 2 hours ride duration
    const dropDateTime = new Date(pickupDate.getTime() + rideDurationInHours * 60 * 60 * 1000);

    // Save ride data to AsyncStorage
    const newRideData = {
      passengers: parseInt(passengers, 10),
      pickupDateTime: pickupDate.toISOString(),
      dropDateTime: dropDateTime.toISOString(),
    };

    // Update local state with other parameters and new ride data
    setRideData((prevData) => ({
      ...prevData,
      passengers: newRideData.passengers,
      pickupDateTime: newRideData.pickupDateTime,
      dropDateTime: newRideData.dropDateTime,
    }));

    // Save updated rideData to AsyncStorage
    await saveRideData({
      ...rideData,
      passengers: newRideData.passengers,
      pickupDateTime: newRideData.pickupDateTime,
      dropDateTime: newRideData.dropDateTime,
    });

    setShowPopup(true); // Show popup after scheduling the ride
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDateType === 'pickup') {
        setPickupDate(selectedDate);
        setRideData((prevData) => ({
          ...prevData,
          pickupDateTime: selectedDate.toISOString(),
        }));
      } else {
        setDropDate(selectedDate);
        setRideData((prevData) => ({
          ...prevData,
          dropDateTime: selectedDate.toISOString(),
        }));
      }
    }
  };

  const showDatepicker = (type) => {
    setShowDatePicker(true);
    setSelectedDateType(type);
  };

  const handleCheckout = async () => {
    // Retrieve user_id from AsyncStorage
    const value = await AsyncStorage.getItem('user');

    // Prepare the query parameters
    const checkoutQuery = {
      current_latitude: rideData.current_latitude.toString(),
      current_longitude: rideData.current_longitude.toString(),
      destination_latitude: rideData.destination_latitude.toString(),
      destination_longitude: rideData.destination_longitude.toString(),
      pickup_address: rideData.current_address.toString(),
      destination_address: rideData.destination_address,
      people_count: rideData.passengers,
      pickup_time: rideData.pickupDateTime.split('T')[1], // Extract time from ISO string
      user: value,
      status: 1,
    };

    // Run your fetch function with the checkoutQuery
    try {
      const response = await fetch(`${API_URL}/api/create-booking-data/`, {
        method: 'POST', // Change the method based on your API requirements
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        body: JSON.stringify(checkoutQuery),
      });

      // Handle the response as needed
      if (response.ok) {
        const responseData = await response.json();
        try {
          const key = 'rideData';
          await AsyncStorage.removeItem(key);
          console.log('Key removed successfully');
        } catch (error) {
          console.error('Error removing key:', error);
        }
        console.log('Checkout successful:', responseData);
        Alert.alert('Booking Successful', 'Your ride has been successfully booked.');
        navigation.navigate('Rides');
      } else {
        const errorResponseData = await response.json();
        console.error('Checkout failed:', errorResponseData.error); // Assuming error response includes an 'error' field
        Alert.alert('Booking Failed', `Error: ${errorResponseData.error}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }

    // Close the popup after the fetch is complete
    handleClosePopup();
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Back width="24" height="24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check out</Text>
        </View>


        <View style={styles.section}>
          <Text style={styles.label}>Passengers</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number of passengers - Click Here!"
            placeholderTextColor={"black"}
            value={passengers}
            onChangeText={(text) => setPassengers(text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Drop Location</Text>
          <TouchableOpacity onPress={handleLocationPickerPress} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{dropLocation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pickup Date & Time</Text>
          <TouchableOpacity style={styles.changeButton} onPress={() => showDatepicker('pickup')}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{pickupDate.toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleRide}>
          <Text style={styles.scheduleButtonText}>SCHEDULE RIDE</Text>
        </TouchableOpacity>

        {/* Checkout Popup */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPopup}
          onRequestClose={handleClosePopup}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Ride Details</Text>
              <Text style={styles.popupText}>Pickup Date & Time: {pickupDate ? pickupDate.toLocaleString() : 'No Data'}</Text>
              <Text style={styles.popupText}>Pickup Location: {pickupLocation ? pickupLocation : 'No Data'}</Text>
              <Text style={styles.popupText}>Drop Location: {dropLocation ? dropLocation : 'No Data'}</Text>
              <Text style={styles.popupText}>Passengers Count: {rideData.passengers ? rideData.passengers : 'No Data'}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={handleClosePopup}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDateType === 'pickup' ? pickupDate : dropDate}
            mode="datetime"
            is24Hour={false}
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()} // Restrict to current date and future dates
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#9b59b6',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingTop: 30,
  },
  backButton: {
    marginRight: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#ffc107',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  label: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#9b59b6',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  changeButton: {
    padding: 10,
    backgroundColor: '#9b59b6',
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  changeButtonText: {
    fontSize: 16,
    color: 'white',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
  scheduleButton: {
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  scheduleButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  // Styles for Popup
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  popupText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#9b59b6',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  checkoutText: {
    fontSize: 16,
    color: 'white',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
  datePicker: {
    backgroundColor: 'white',
  },
  input: {
    color: 'black',
    fontWeight: 'bold',
  }
});

export default CheckoutPage;
