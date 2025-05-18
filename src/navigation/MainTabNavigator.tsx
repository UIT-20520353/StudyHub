import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
// import HomeScreen from "../screens/main/HomeScreen";
// import CommunityScreen from "../screens/main/CommunityScreen";
// import ProfileScreen from "../screens/main/ProfileScreen";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import HomeScreen from "../screens/main/HomeScreen";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";
import CommunityScreen from "../screens/main/CommunityScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { t } = useTranslation(NAMESPACES.TABS);

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
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t("home") }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ title: t("marketplace") }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ title: t("community") }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Hồ sơ" }}
      /> */}
    </Tab.Navigator>
  );
}
