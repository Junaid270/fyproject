import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePost } from "../context/PostContext";

const exampleImage = require("../assets/simple-issue.png"); // Replace with your image URL

const HomeScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { posts, fetchPosts } = usePost();

  useEffect(() => {
    fetchPosts();
  }, []);

  const categories = [
    {
      name: "All",
      subcategories: [],
    },
    {
      name: "Category1",
      subcategories: ["Subcategory1.1", "Subcategory1.2", "Subcategory1.3"],
    },
    {
      name: "Category2",
      subcategories: ["Subcategory2.1", "Subcategory2.2"],
    },
    {
      name: "Category3",
      subcategories: ["Subcategory3.1", "Subcategory3.2", "Subcategory3.3"],
    },
  ];

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilter === "All" || post.tags.includes(selectedFilter);
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category) => {
    setSelectedFilter(category);
    setDropdownVisible(false);
    setExpandedCategory(null);
  };

  const toggleExpandedCategory = (mainCategory) => {
    setExpandedCategory(
      expandedCategory === mainCategory ? null : mainCategory
    );
  };

  const renderPost = (post) => (
    <TouchableOpacity
      key={`post-${post._id}`}
      onPress={() => navigation.navigate("PostDetails", { post })}
      style={styles.post}
    >
      <Image
        source={{ uri: post.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description}>{post.description}</Text>
      <Text style={styles.location}>📍 {post.location.address}</Text>
      <Text style={styles.tags}>
        {post.tags.map((tag) => `#${tag}`).join(" ")}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.author}>Posted by: {post.author.username}</Text>
        <Text style={styles.status}>Status: {post.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable
          style={styles.filterButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.filterButtonText}>
            {selectedFilter} <MaterialIcons name="arrow-drop-down" size={24} />
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredPosts.map(renderPost)}
      </ScrollView>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {categories.map((category) => (
              <View key={`category-${category.name}`}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() =>
                    category.subcategories.length > 0
                      ? toggleExpandedCategory(category.name)
                      : handleCategorySelect(category.name)
                  }
                >
                  <Text style={styles.dropdownText}>{category.name}</Text>
                </TouchableOpacity>
                {expandedCategory === category.name &&
                  category.subcategories.map((subcategory) => (
                    <TouchableOpacity
                      key={`subcategory-${category.name}-${subcategory}`}
                      style={styles.subcategoryItem}
                      onPress={() => handleCategorySelect(subcategory)}
                    >
                      <Text style={styles.subcategoryText}>{subcategory}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#d7d7d7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007AFF",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#005BBB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  scrollView: {
    width: "100%",
  },
  post: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tags: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "400",
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  author: {
    fontSize: 12,
    color: "#666",
  },
  status: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "80%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  subcategoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: "#F7F7F7",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  subcategoryText: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomeScreen;
