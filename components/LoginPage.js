import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Touchable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const sendToRegister = async () => {
    navigation.navigate('RegisterPage');
  };

  const sendToReset = async () => {
    navigation.navigate('ResetPassword');
  };

  const loginSuccess = async () => {
    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    if (!username) {
      alert('Please fill in the username');
      return;
    }

    if (!password) {
      alert('PLease fill in correct password');
      return;
    }

    try {
      const requestBody = {
        username: username,
        password: password,
      }

      console.log(requestBody);

      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const { user_id } = responseData.main;

      console.log('Login successful. User ID:', user_id);
      alert('Your Login is successful!');

      // Store user_id in AsyncStorage
      await AsyncStorage.setItem('user', user_id.toString());

      // Navigate to the SelectCarPage
      navigation.navigate('SelectCarPage');
    } catch (error) {
      console.error('Login failed:', error);

      // Additional error handling based on error types
      if (error instanceof TypeError) {
        // Handle network errors or fetch errors
        alert('Network error occurred. Please check your internet connection.');
      } else if (error instanceof SyntaxError) {
        // Handle JSON parsing errors
        alert('Error parsing server response. Please try again later.');
      } else {
        // Handle other types of errors
        alert('Login failed. Please try again later.');
      }
    }
  };

  return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} enabled>
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome Back!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username:</Text>
            <TextInput style={styles.input} placeholder="Enter your username" placeholderTextColor="black" onChangeText={(text) => setUsername(text)} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry placeholderTextColor="black" onChangeText={(text) => setPassword(text)} />
          </View>

          <TouchableOpacity onPress={sendToReset}><Text style={styles.link}>Forgot your password?</Text></TouchableOpacity>

          <TouchableOpacity style={styles.buttonContainer} onPress={loginSuccess}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text>Don't have an account? <TouchableOpacity onPress={sendToRegister}>
              <Text style={styles.signupLink}>Signup!</Text>
            </TouchableOpacity></Text>
          </View>
        </View>
      </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    padding: 12,
    width: '100%',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  buttonContainer: {
    backgroundColor: '#9b59b6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  signupLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    color: 'black',
  },
});

export default LoginPage;
