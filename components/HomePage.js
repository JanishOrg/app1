import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import from react-native-linear-gradient
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    console.log('Login pressed');
    navigation.navigate('LoginPage');
  };

  const handleRegisterPress = () => {
    console.log('Register pressed');
    navigation.navigate('RegisterPage');
  };

  return (
    <ImageBackground
      source={require('../assets/img/background.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(52, 152, 219, 0.8)', 'rgba(41, 128, 185, 0.8)']}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/img/logo.png')}
            style={styles.appIcon}
          />
        </View>
        <Text style={styles.welcomeText}>Welcome to DriveMe!</Text>
        <Text style={styles.descriptionText}>
          Drive is the best app for your transportation needs. Start now and
          experiment a hassle-free ride.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#9b59b6' }]}
            onPress={handleLoginPress}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#9b59b6' }]}
            onPress={handleRegisterPress}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  iconContainer: {
    marginBottom: 50,
  },
  appIcon: {
    width: 150,
    height: 150,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 80,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10, // Adjust the margin as needed
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;