import React, { useState } from "react";
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

const exampleImage = require("../assets/simple-issue.png"); // Replace with your image URL

const HomeScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null); // Track expanded main category

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

  // Sample data for posts
  const posts = [
    {
      id: 1,
      category: "Subcategory1.1",
      description: "Post in Subcategory 1.1",
      hashtags: "#example #subcategory1.1",
    },
    {
      id: 2,
      category: "Subcategory2.1",
      description: "Post in Subcategory 2.1",
      hashtags: "#example #subcategory2.1",
    },
    {
      id: 3,
      category: "Subcategory3.1",
      description: "Post in Subcategory 3.1",
      hashtags: "#example #subcategory3.1",
    },
    {
      id: 4,
      category: "Subcategory1.2",
      description: "Another post in Subcategory 1.2",
      hashtags: "#example #subcategory1.2",
    },
  ];

  // Filter posts based on the selected category and search query
  const filteredPosts = posts.filter(
    (post) =>
      (selectedFilter === "All" || post.category === selectedFilter) &&
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategorySelect = (category) => {
    setSelectedFilter(category);
    setDropdownVisible(false);
    setExpandedCategory(null); // Collapse categories
    console.log(`Selected filter: ${category}`);
  };

  const toggleExpandedCategory = (mainCategory) => {
    setExpandedCategory(
      expandedCategory === mainCategory ? null : mainCategory
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with filter button and search bar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setDropdownVisible(true)}
        >
          <MaterialIcons name="filter-list" size={24} color="#FFFFFF" />
          <Text style={styles.filterText}>{selectedFilter}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search posts..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Dropdown menu */}
      <Modal
        transparent={true}
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {categories.map((category) => (
              <View key={category.name}>
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
                {/* Display subcategories if expanded */}
                {expandedCategory === category.name &&
                  category.subcategories.map((subcategory) => (
                    <TouchableOpacity
                      key={subcategory}
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

      {/* Post list */}
      <ScrollView style={styles.scrollView}>
        {filteredPosts.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => navigation.navigate("ReportPage")}
          >
            <View style={styles.post}>
              <Image source={exampleImage} style={styles.image} />
              <Text style={styles.description}>{post.description}</Text>
              <Text style={styles.hashtags}>{post.hashtags}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => console.log("Upvote clicked")}
                >
                  <Text style={styles.buttonText}>Upvote</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => console.log("Downvote clicked")}
                >
                  <Text style={styles.buttonText}>Downvote</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => console.log("Share clicked")}
                >
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#d7d7d7",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007AFF",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#005BBB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  filterText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    color: "#333",
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
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  hashtags: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "400",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
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
