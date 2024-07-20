import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const NewPassword = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSetNewPassword = async () => {
    try {
      // Retrieve user_id from AsyncStorage
      const userId = await AsyncStorage.getItem('user');
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }

      // Prepare the request body
      const requestBody = {
        user: userId,
        otp: otp,
        new_password: newPassword,
      };

      // Make the API call to set the new password
      const response = await fetch(`${API_URL}/api/update-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Password reset successful, show a success message
      Alert.alert('Password Reset Successful', 'Your password has been reset successfully.');
      navigation.navigate('LoginPage'); // Navigate to the login page after successful password reset
    } catch (error) {
      console.error('Error setting new password:', error);
      // Show an error message if there's an issue with the network or server
      Alert.alert('Error', 'Failed to reset password. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleSetNewPassword} style={styles.button}>
        <Text style={styles.buttonText}>Set New Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoBack} style={styles.goBack}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goBack: {
    marginTop: 20,
  },
  goBackText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default NewPassword;
