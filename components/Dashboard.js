import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import Location from '../assets/icons/location-svgrepo-com.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const Dashboard = () => {
  const mapRef = useRef(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideData, setRideData] = useState({
    current_latitude: null,
    current_longitude: null,
    current_address: null,
    destination_latitude: null,
    destination_longitude: null,
    destination_address: null,
  });
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [isSelectingPickup, setIsSelectingPickup] = useState(false);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false);

  useEffect(() => {
    loadRideData();
    getCurrentLocation();
  }, []);

  const saveRideData = async (data) => {
    try {
      await AsyncStorage.setItem('rideData', JSON.stringify(data));
      const allData = await getAllDataInStorage();
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
        if (parsedData.current_latitude && parsedData.current_longitude) {
          setPickupLocation({
            latitude: parsedData.current_latitude,
            longitude: parsedData.current_longitude,
            address: parsedData.current_address,
          });
        }
        if (parsedData.destination_latitude && parsedData.destination_longitude) {
          setDestination({
            latitude: parsedData.destination_latitude,
            longitude: parsedData.destination_longitude,
            address: parsedData.destination_address,
          });
        }
      }
    } catch (error) {
      console.error('Error loading ride data:', error);
    }
  };

  const GOOGLE_API_KEY = 'AIzaSyBJvvPvzCPEAaTa2abV448G_aYJPgDz0-c';

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
    );
  };

  const animateToLocation = (location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const current = () => {
    if (currentLocation) {
      animateToLocation(currentLocation);
    } else {
      getCurrentLocation();
    }
  };

  const onPickupSelected = async (details) => {
    const newPickupLocation = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: details.formatted_address,
    };
    setPickupLocation(newPickupLocation);
    animateToLocation(newPickupLocation);
    const updatedRideData = {
      ...rideData,
      current_latitude: newPickupLocation.latitude,
      current_longitude: newPickupLocation.longitude,
      current_address: newPickupLocation.address,
    };
    setRideData(updatedRideData);
    saveRideData(updatedRideData);
  };

  const onDestinationSelected = async (details) => {
    const newDestination = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: details.formatted_address,
    };
    setDestination(newDestination);
    animateToLocation(newDestination);
    const updatedRideData = {
      ...rideData,
      destination_latitude: newDestination.latitude,
      destination_longitude: newDestination.longitude,
      destination_address: newDestination.address,
    };
    setRideData(updatedRideData);
    saveRideData(updatedRideData);
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

  const onMapLongPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    const address = await fetchAddress(coordinate);
    if (isSelectingPickup) {
      const newPickupLocation = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: address,
      };
      setPickupLocation(newPickupLocation);
      animateToLocation(coordinate);
      setIsSelectingPickup(false);
      const updatedRideData = {
        ...rideData,
        current_latitude: newPickupLocation.latitude,
        current_longitude: newPickupLocation.longitude,
        current_address: newPickupLocation.address,
      };
      setRideData(updatedRideData);
      saveRideData(updatedRideData);
    } else if (isSelectingDestination) {
      const newDestination = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: address,
      };
      setDestination(newDestination);
      animateToLocation(coordinate);
      setIsSelectingDestination(false);
      const updatedRideData = {
        ...rideData,
        destination_latitude: newDestination.latitude,
        destination_longitude: newDestination.longitude,
        destination_address: newDestination.address,
      };
      setRideData(updatedRideData);
      saveRideData(updatedRideData);
    }
  };

  const fetchAddress = async (coordinate) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_API_KEY}`);
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  };

  const selectPickup = () => {
    setIsSelectingPickup(true);
    setIsSelectingDestination(false);
  };

  const selectDestination = () => {
    setIsSelectingDestination(true);
    setIsSelectingPickup(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={currentLocation}
        onLongPress={onMapLongPress}
      >
        {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup Location" />}
        {destination && <Marker coordinate={destination} title="Destination Location" />}
      </MapView>

      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder='Enter pickup location'
          textInputProps={{
            placeholderTextColor: 'black',
            color: 'black',
            value: pickupLocation,
          }}
          onPress={(data, details = null) => onPickupSelected(details)}
          fetchDetails={true}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
          styles={styles.inputContainer}
        />

        <GooglePlacesAutocomplete
          placeholder='Enter destination location'
          textInputProps={{
            placeholderTextColor: 'black',
            color: 'black',
            value: destination,
          }}
          onPress={(data, details = null) => onDestinationSelected(details)}
          fetchDetails={true}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
          styles={styles.inputContainer}
        />
      </View>

      <TouchableOpacity style={styles.locateButton} onPress={current}>
        <Location
          width="24"
          height="24"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate('CheckoutPage')}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pickupButton} onPress={selectPickup}>
        <Text style={styles.buttonText}>Select Pickup</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.destinationButton} onPress={selectDestination}>
        <Text style={styles.buttonText}>Select Destination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black",
  },
  inputContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    width: '100%',
    zIndex: 5,
  },
  textInputContainer: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
  },
  locationInput: {
    height: 44,
    fontSize: 18,
    color: "black",
  },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    left: '35%',
    marginLeft: -25,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  bookButton: {
    position: 'absolute',
    bottom: 30,
    left: '65%',
    marginLeft: -50,
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 30,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickupButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  destinationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default Dashboard;
