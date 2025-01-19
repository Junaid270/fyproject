import React from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nagrik Seva</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.post}>
          <Text style={styles.description}>This is a post description</Text>
          <Text style={styles.hashtags}>#example #post</Text>
          <View style={styles.buttons}>
            <Button title="Upvote" onPress={() => {}} />
            <Button title="Downvote" onPress={() => {}} />
            <Button title="Share" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  scrollView: {
    width: "100%",
  },
  post: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  description: {
    fontSize: 16,
  },
  hashtags: {
    fontSize: 14,
    color: "#888",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default HomeScreen;
