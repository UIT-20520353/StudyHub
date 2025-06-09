import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Badge } from "../components/common/Badge";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";
import { MainTabParamList } from "../types/navigation";
import CartStackNavigator from "./CartStackNavigator";
import CommunityStackNavigator from "./CommunityStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import MarketNavigator from "./MarketNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

const SCREENS_WITHOUT_TAB_BAR = [
  "Language",
  "Profile",
  "TopicDetail",
  "CreateTopic",
  "ProductDetail",
  "Checkout",
  "CreateProduct",
  "History",
  "SellerOrders",
  "HistoryMenu",
  "Notification",
  "ChangePassword",
];

export default function MainTabNavigator() {
  const { t } = useTranslation(NAMESPACES.TABS);
  const cartItems = useAppSelector((state) => state.cart.items);

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
            case "Cart":
              iconName = "shopping-bag";
              break;
            default:
              iconName = "home";
          }

          return (
            <View>
              <MaterialIcons name={iconName} size={size} color={color} />
              {route.name === "Cart" && <Badge count={cartItems.length} />}
            </View>
          );
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
        component={HomeStackNavigator}
        options={{ title: t("home") }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketNavigator}
        options={{ title: t("marketplace") }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{ title: t("cart") }}
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
