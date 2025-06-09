import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../screens/main/HomeScreen";
import NotificationScreen from "../screens/main/NotificationScreen";
import { colors } from "../theme/colors";
import TopicDetailScreen from "../screens/main/community/TopicDetailScreen";
import { MainTabNavigationProp, MainTabParamList } from "../types/navigation";
import ProductDetailScreen from "../screens/main/market/ProductDetailScreen";

const Stack = createStackNavigator<MainTabParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.common.white,
        },
        headerTintColor: colors.common.gray3,
        headerTitleStyle: {
          fontFamily: "OpenSans_600SemiBold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ title: "Thông báo" }}
      />
      <Stack.Screen
        name="TopicDetail"
        component={TopicDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
