import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// import HomeScreen from "../screens/main/HomeScreen";
// import CommunityScreen from "../screens/main/CommunityScreen";
// import ProfileScreen from "../screens/main/ProfileScreen";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Marketplace":
              iconName = "shopping-cart";
              break;
            case "Community":
              iconName = "groups";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "home";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1976D2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/* <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ" }}
      /> */}
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ title: "Mua bán" }}
      />
      {/* <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: "Cộng đồng" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Hồ sơ" }}
      /> */}
    </Tab.Navigator>
  );
}
