import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CreatePostScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.blankText}>Blank</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blankText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CreatePostScreen;
