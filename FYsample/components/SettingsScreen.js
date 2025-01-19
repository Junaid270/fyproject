import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/Homebackground.jpg')}  // Path to the background image
      style={styles.background} // Apply the styles to the background image
    >
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')} // Navigate to Profile
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Feature coming soon!")} // Placeholder for future features
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Feature coming soon!")} // Placeholder for future features
        >
          <Text style={styles.buttonText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()} // Go back to the previous screen
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: '#235DFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SettingsScreen;
