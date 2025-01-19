import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/Homebackground.jpg')}  // Path to your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../assets/profile.png')} style={styles.profileImage} />
        
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>Manage your account information.</Text>

        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Username: JohnDoe</Text>
          <Text style={styles.profileText}>Email: johndoe@example.com</Text>
          <Text style={styles.profileText}>Phone: +1234567890</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignIn')} // Navigate to SignIn to log out
        >
          <Text style={styles.buttonText}>Log Out</Text>
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
    width: '100%',
    backgroundColor: 'rgba(133, 165, 253, 0.5)',  // Semi-transparent background for better readability
    borderRadius: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 30,
    alignItems: 'flex-start',
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4374ff', // Updated button color
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default ProfileScreen;
