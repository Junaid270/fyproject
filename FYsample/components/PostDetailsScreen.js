import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;

  const mapRegion = {
    latitude: post.location.latitude,
    longitude: post.location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: post.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  post.status === "pending"
                    ? "#FFA500"
                    : post.status === "in-progress"
                    ? "#007AFF"
                    : "#28a745",
              },
            ]}
          >
            {post.status}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoText}>{post.location.address}</Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion}>
            <Marker
              coordinate={{
                latitude: post.location.latitude,
                longitude: post.location.longitude,
              }}
              title={post.title}
              description={post.location.address}
            />
          </MapView>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Tags:</Text>
          <Text style={styles.tags}>
            {post.tags.map((tag, index) => (
              <Text key={`tag-${post._id}-${index}`}>#{tag} </Text>
            ))}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Posted by:</Text>
          <Text style={styles.infoText}>{post.author.username}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
    width: 80,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tags: {
    fontSize: 16,
    color: "#007AFF",
    flex: 1,
  },
  mapContainer: {
    height: 300,
    marginVertical: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default PostDetailsScreen;
