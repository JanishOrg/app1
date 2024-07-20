/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import HomePage from './components/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import OTP from './components/OTP';
import Reset from './components/ResetPassword';
import SelectCarPage from './components/SelectCarPage';
import CheckoutPage from './components/CheckoutPage';
import Rides from './components/Rides';
import Farechart from './components/Farechart';
import Faq from './components/Faq';
import Helpandsupport from './components/Helpandsupport';
import Shareapp from './components/Shareapp';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="ResetPassword" component={Reset} />
        <Stack.Screen name="SelectCarPage" component={SelectCarPage} />
        <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
        <Stack.Screen name="Rides" component={Rides} />
        <Stack.Screen name="Farechart" component={Farechart} />
        <Stack.Screen name="Faq" component={Faq} />
        <Stack.Screen name="Helpandsupport" component={Helpandsupport} />
        <Stack.Screen name="Shareapp" component={Shareapp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;