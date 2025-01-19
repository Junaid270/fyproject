import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { Text } from 'react-native';
import OnboardingScreen from './components/OnboardingScreen';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen'; // Example Profile Screen
import ReportIssueScreen from './components/ReportIssueScreen'; // Example Report Issue Screen
import SettingsScreen from './components/SettingsScreen'; // Example Settings Screen
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const slides = [
  {
    key: '1',
    title: 'Simple Issue Reporting',
    image: require('./assets/simple-issue.png'),
    text: 'Easily report local issues like potholes or broken streetlights in just a few taps! Add photos or videos and help improve your community',
  },
  {
    key: '2',
    title: 'GPS-Based \n Location Tagging',
    image: require('./assets/locationTag.png'),
    text: 'Let us pinpoint the exact location of the issue for you using GPS, making sure your report reaches the right people instantly',
  },
  {
    key: '3',
    title: 'Real-Time Updates ',
    image: require('./assets/realtime.png'),
    text: 'Stay informed! Track the status of your reports with real-time updates as they move from submitted to resolved',
  }
];

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'CustomFont-Regular': require('./assets/fonts/Think.otf'),
        'CustomFont-Bold': require('./assets/fonts/Think.ttf'),
      });
      setFontsLoaded(true); // Set fontsLoaded to true once fonts are loaded
    };

    loadFonts();
  }, []);

  // Show a loading screen while fonts are being loaded
  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#d7d7d7' }
          }}
        >
          <Stack.Screen name="Onboarding">
            {props => <OnboardingScreen {...props} slides={slides} />}
          </Stack.Screen>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
