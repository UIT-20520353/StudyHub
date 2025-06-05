import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import CommunityStackNavigator from "./CommunityStackNavigator";
import HomeScreen from "../screens/main/HomeScreen";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";
import { colors } from "../theme/colors";
import { MainTabParamList } from "../types/navigation";
import SettingsStackNavigator from "./SettingsStackNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

const SCREENS_WITHOUT_TAB_BAR = [
  "Language",
  "Profile",
  "TopicDetail",
  "CreateTopic",
];

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
            case "Settings":
              iconName = "settings";
              break;
            default:
              iconName = "home";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.common.gray,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "OpenSans_600SemiBold",
          fontSize: 10,
        },
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";

          if (SCREENS_WITHOUT_TAB_BAR.includes(routeName)) {
            return { display: "none" };
          }

          return {
            display: "flex",
          };
        })(route),
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
        component={CommunityStackNavigator}
        options={{ title: t("community") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ title: t("settings") }}
      />
    </Tab.Navigator>
  );
}
