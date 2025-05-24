import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SettingsScreen from "../screens/main/SettingsScreen";
// import ProfileScreen from ".../screens/main/settings/LanguageScreen"
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import LanguageScreen from "../screens/main/settings/LanguageScreen";
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
        component={LanguageScreen}
        options={{ title: t("profile") }}
      />
    </Stack.Navigator>
  );
}
