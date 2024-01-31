import React from 'react';
import { Provider } from 'react-redux';
import { Text } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './reducer/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import SigninScreen from './screens/SignInScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Main') {
            iconName = 'home'; // Remove the space here
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ec6e5b',
        tabBarInactiveTintColor: '#335561',
        headerShown: false,
      })}
    >
      <Tab.Screen name='Profile' component={ProfileScreen} />
      <Tab.Screen name='Main' component={MainScreen} />
    </Tab.Navigator>
  );
};



export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name='TabNavigator' component={TabNavigator} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen name='SignIn' component={SigninScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider >
  );
}

