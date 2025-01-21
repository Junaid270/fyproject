import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { usePost } from "../context/PostContext";

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;
  const { user } = useAuth();
  const { upvotePost, downvotePost, reportPost, checkReportStatus } = usePost();

  const handleUpvote = async () => {
    const result = await upvotePost(post._id);
    if (!result.success) {
      Alert.alert("Error", result.message || "Failed to upvote");
    }
  };

  const handleDownvote = async () => {
    const result = await downvotePost(post._id);
    if (!result.success) {
      Alert.alert("Error", result.message || "Failed to downvote");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this issue: ${post.title}\n${
          post.description
        }\nLocation: ${post.location?.address || "No address provided"}`,
        title: post.title,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share post");
    }
  };

  const handleReport = () => {
    Alert.prompt(
      "Report Post",
      "Please provide a reason for reporting this post:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: async (reason) => {
            if (!reason || reason.trim() === "") {
              Alert.alert("Error", "Please provide a reason for reporting");
              return;
            }

            const result = await reportPost(post._id, reason.trim());
            if (result.success) {
              Alert.alert(
                "Success",
                result.message || "Post reported successfully"
              );
            } else {
              Alert.alert(
                "Error",
                result.message 
              );
            }
          },
        },
      ],
      "plain-text",
      "",
      "default"
    );
  };

  const checkReports = async () => {
    const status = await checkReportStatus(post._id);
    if (status) {
      Alert.alert(
        "Report Status",
        `Reports: ${status.reportCount}\nThreshold: ${
          status.reportsThreshold
        }\nExceeds Threshold: ${
          status.exceedsThreshold ? "Yes" : "No"
        }\n\nRecent Reports: ${status.reports
          .slice(-3)
          .map((r) => `\n- ${r.reason}`)
          .join("")}`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>
            {post.category || "Uncategorized"}
          </Text>
        </View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.location}>
          📍 {post.location?.address || "No address provided"}
        </Text>
        <Text style={styles.author}>
          Posted by: {post.username || "Anonymous User"}
        </Text>
        <Text style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.interactionBar}>
          <View style={styles.voteContainer}>
            <TouchableOpacity onPress={handleUpvote} style={styles.voteButton}>
              <MaterialIcons
                name="thumb-up"
                size={24}
                color={post.upvotes?.includes(user?._id) ? "#007AFF" : "#666"}
              />
              <Text style={styles.voteCount}>{post.upvotes?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDownvote}
              style={styles.voteButton}
            >
              <MaterialIcons
                name="thumb-down"
                size={24}
                color={post.downvotes?.includes(user?._id) ? "#FF3B30" : "#666"}
              />
              <Text style={styles.voteCount}>
                {post.downvotes?.length || 0}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <MaterialIcons name="share" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReport}
              style={styles.actionButton}
            >
              <MaterialIcons name="flag" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={checkReports}
            >
              <MaterialIcons name="info" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.status, styles[post.status]]}>
            Status: {post.status}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  voteCount: {
    marginLeft: 5,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 20,
  },
  statusContainer: {
    marginTop: 15,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pending: {
    color: "#FFA500",
  },
  "in-progress": {
    color: "#007AFF",
  },
  resolved: {
    color: "#28a745",
  },
});

export default PostDetailsScreen;
