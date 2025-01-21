    import React from "react";
    import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
    import HomeScreen from "./HomeScreen";
    import CreatePostScreen from "./CreatePostScreen";
    import ProfileScreen from "./ProfileScreen";
    import { Ionicons } from 'react-native-vector-icons';
    import { Text,View } from "react-native";

    const Tab = createBottomTabNavigator();

    const BottomTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 60, // Adjust the height of the tab bar
            paddingTop: 10,
          },
        }}
      >
        <Tab.Screen
          name="Nagrik Seva"
          component={HomeScreen}
          options={{
            tabBarLabel: () => null, // Correct way to hide the label
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={30} color={color} /> // Make the icon bigger
            ),
            headerTitle: () => (
              <View
                style={{
                  height: 60, // Adjust the header height as needed
                  backgroundColor: "#fff", // Header background color
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative", // Ensure proper positioning within the parent
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#326BDF",
                    textAlign: "center",
                    fontFamily: "Think", // Ensure this font is properly loaded
                    paddingLeft: 114,
                  }}
                >
                  Nagrik Seva
                </Text>
              </View>
            ), // Custom header title with styling
          }}
        />
        <Tab.Screen
          name="Create Post"
          component={CreatePostScreen}
          options={{
            tabBarLabel: () => null, // Correct way to hide the label
            tabBarIcon: ({ color }) => (
              <Ionicons name="create-outline" size={30} color={color} /> // Make the icon bigger
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: () => null, // Correct way to hide the label
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={30} color={color} /> // Make the icon bigger
            ),
          }}
        />
      </Tab.Navigator>
    );
    };

    export default BottomTabs;
