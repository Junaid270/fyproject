import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "../../context/PostContext";
import config from "../../config";

const Reports = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { deletePost } = usePost();

  const fetchReportedPosts = async () => {
    try {
      const response = await fetch(`${config.API_URL}/admin/reported-posts`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reported posts");
      }

      const data = await response.json();
      setReportedPosts(data);
    } catch (error) {
      console.error("Error fetching reported posts:", error);
      Alert.alert("Error", "Failed to load reported posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deletePost(postId);
              if (result.success) {
                setReportedPosts((prev) =>
                  prev.filter((post) => post._id !== postId)
                );
                Alert.alert("Success", "Post deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete post");
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post");
            }
          },
        },
      ]
    );
  };

  const renderReportItem = ({ item: post }) => (
    <View style={styles.reportCard}>
      <Image source={{ uri: post.image }} style={styles.postImage} />
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.reportCount}>Reports: {post.reportCount}</Text>
        <Text style={styles.reportReason}>
          Recent reports:
          {post.reports.slice(-3).map((report, index) => (
            <Text key={index} style={styles.reason}>
              {"\n"}- {report.reason}
            </Text>
          ))}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePost(post._id)}
      >
        <MaterialIcons name="delete" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reported Posts</Text>
      {reportedPosts.length === 0 ? (
        <Text style={styles.noReports}>No reported posts</Text>
      ) : (
        <FlatList
          data={reportedPosts}
          renderItem={renderReportItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  list: {
    padding: 15,
  },
  reportCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  postInfo: {
    flex: 1,
    marginLeft: 15,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reportCount: {
    fontSize: 14,
    color: "#FF3B30",
    marginBottom: 5,
  },
  reportReason: {
    fontSize: 12,
    color: "#666",
  },
  reason: {
    color: "#666",
  },
  deleteButton: {
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noReports: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default Reports;
