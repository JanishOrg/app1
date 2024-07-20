// Reset.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {API_URL} from '@env';

const Reset = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = async () => {
    try {
      // Make the API call to the forgot password endpoint
      const response = await fetch(`${API_URL}/api/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Reset successful, show a success message
        Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
        navigation.navigate('OTP');
      } else {
        // Reset failed, show an error message
        Alert.alert('Error', 'Failed to reset password. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending forgot password request:', error);
      // Show an error message if there's an issue with the network or server
      Alert.alert('Network Error', 'Failed to connect to the server. Please check your network connection and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
        <Text style={styles.buttonText}>Reset Password</Text>
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

export default Reset;
