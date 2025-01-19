import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Username: user123</Text>
      <Text style={styles.profileText}>Phone Number: 123-456-7890</Text>
      <Text style={styles.profileText}>Aadhar Number: 1234-5678-9012</Text>
      <Text style={styles.profileText}>Email: user@example.com</Text>
      <View style={styles.userPosts}>
        <Text>User's post 1</Text>
        <Button title="Delete" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    marginVertical: 5,
  },
  userPosts: {
    marginTop: 20,
  },
});

export default ProfileScreen;
