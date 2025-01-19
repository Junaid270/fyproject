import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ReportIssueScreen = ({ navigation }) => {
  const [issueDescription, setIssueDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Request permissions for image picking
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need permission to access your photos');
    }
  };

  useEffect(() => {
    // Request permissions when the screen is loaded
    requestPermissions();
  }, []);

  // Open image picker for selecting an image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  // Open camera to take a new picture
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleReport = () => {
    if (issueDescription && location) {
      alert('Issue Reported Successfully');
      navigation.goBack();
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Homebackground.jpg')} // Add background image here
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Report an Issue</Text>

        <Text style={styles.label}>Issue Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe the issue"
          value={issueDescription}
          onChangeText={setIssueDescription}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Image Picker Section */}
        <Text style={styles.label}>Attach an Image (Optional)</Text>
        <View style={styles.imagePickerContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text>No image selected</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Image from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReport}>
          <Text style={styles.buttonText}>Submit Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={() => navigation.goBack()}>
          {/* Image inside the button */}
          <Image 
            source={require('../assets/back.png')} // Path to your image
            style={styles.imageInButton}
          />
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
    width: '100%',
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
    color: 'white', // Ensure the text is visible on the background image
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: 'white', // White color for labels to match the background
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor:'rgba(251, 251, 251, 0.3)',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(50, 101, 239, 0.89)',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imagePickerContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  button1: {
    backgroundColor: 'rgba(50, 100, 239, 0.02)', // Light color for the button background
    padding: 15,
    margin: 10,
    borderRadius: 8,
    width: 100, // You can set a fixed width for the image button
    height: 100, // Adjust the height for the image button
    alignItems: 'center',  // Center the image within the button
    justifyContent: 'center', // Center the image vertically as well
    position: 'absolute', // Allows for absolute positioning
    top: 50, // Align it 10 units from the top of the screen
    left: 0, // Align it 10 units from the left of the screen
  },
  imageInButton: {
    width: 50, // Adjust image size
    height: 50, // Adjust image size
    borderRadius: 25,
    resizeMode: 'contain',
  },
});

export default ReportIssueScreen;
