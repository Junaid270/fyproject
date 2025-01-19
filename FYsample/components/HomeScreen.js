  import React from "react";
  import {
    View,
    Text,
    ScrollView,
    Button,
    StyleSheet,
    Image,
  } from "react-native";

  // Example local image
  const exampleImage = require("../assets/realtime.png");

  const HomeScreen = () => {
    // Handlers for button presses
    const handleUpvote = () => {
      console.log("Upvote button pressed");
    };

    const handleDownvote = () => {
      console.log("Downvote button pressed");
    };

    const handleShare = () => {
      console.log("Share button pressed");
    };

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nagrik Seva</Text>
        <ScrollView style={styles.scrollView}>
          <View style={styles.post}>
            {/* Add the image above the description */}
            <Image source={exampleImage} style={styles.image} />
            <Text style={styles.description}>This is a post description</Text>
            <Text style={styles.hashtags}>#example #post</Text>
            <View style={styles.buttons}>
              <Button title="Upvote" onPress={handleUpvote} />
              <Button title="Downvote" onPress={handleDownvote} />
              <Button title="Share" onPress={handleShare} />
            </View>
          </View>
          <View style={styles.post}>
            {/* Add the image above the description */}
            <Image source={exampleImage} style={styles.image} />
            <Text style={styles.description}>This is a post description</Text>
            <Text style={styles.hashtags}>#example #post</Text>
            <View style={styles.buttons}>
              <Button title="Upvote" onPress={handleUpvote} />
              <Button title="Downvote" onPress={handleDownvote} />
              <Button title="Share" onPress={handleShare} />
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
      backgroundColor: 'red',
      marginBottom: 20,
    },
    image: {
      width: "100%", // Full width of the parent container
      height: 300, // Fixed height for the image
      resizeMode: "cover", // Ensure the image covers the space proportionally
      marginBottom: 20,
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
