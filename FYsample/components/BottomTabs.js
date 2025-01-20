    import React from "react";
    import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
    import HomeScreen from "./HomeScreen";
    import CreatePostScreen from "./CreatePostScreen";
    import ProfileScreen from "./ProfileScreen";
    import { Ionicons } from 'react-native-vector-icons';

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
