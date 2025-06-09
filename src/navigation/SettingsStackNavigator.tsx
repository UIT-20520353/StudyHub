import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SettingsScreen from "../screens/main/SettingsScreen";
// import ProfileScreen from ".../screens/main/settings/LanguageScreen"
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import LanguageScreen from "../screens/main/settings/LanguageScreen";
import ProfileScreen from "../screens/main/settings/ProfileScreen";
import HistoryMenuScreen from "../screens/main/settings/HistoryMenuScreen";
import HistoryScreen from "../screens/main/settings/HistoryScreen";
import SellerOrdersScreen from "../screens/main/settings/SellerOrdersScreen";
import ChangePasswordScreen from "../screens/main/settings/ChangePasswordScreen";
import { colors } from "../theme/colors";

const Stack = createStackNavigator();

export default function SettingsStackNavigator() {
  const { t } = useTranslation(NAMESPACES.SETTINGS);

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
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: t("language") }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("profile") }}
      />
      <Stack.Screen
        name="HistoryMenu"
        component={HistoryMenuScreen}
        options={{ title: "Lịch sử" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "Lịch sử mua hàng" }}
      />
      <Stack.Screen
        name="SellerOrders"
        component={SellerOrdersScreen}
        options={{ title: "Quản lý đơn hàng bán" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Đổi mật khẩu" }}
      />
    </Stack.Navigator>
  );
}
