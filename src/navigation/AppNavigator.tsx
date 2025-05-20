import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";
import SplashScreen from "../screens/static/SplashScreen";
import { useAuth } from "../contexts/AuthContext";
import * as ExpoSplashScreen from "expo-splash-screen";

import {
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";

// Prevent the splash screen from auto-hiding
ExpoSplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        // Hide native splash screen
        await ExpoSplashScreen.hideAsync();

        // Wait for fonts to load
        if (!fontsLoaded) {
          return;
        }

        // Show custom splash screen for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Hide custom splash screen
        setShowSplash(false);
      } catch (e) {
        console.warn("Error during app preparation:", e);
        setShowSplash(false);
      }
    };

    prepare();
  }, [fontsLoaded]); // Add fontsLoaded as dependency

  if (showSplash || !fontsLoaded || loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
