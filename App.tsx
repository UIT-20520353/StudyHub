import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import initI18n from "./src/i18n";
import { ActivityIndicator, View, LogBox } from "react-native";
import { AuthProvider } from "./src/contexts/AuthContext";

// Disable Inspector warnings
LogBox.ignoreLogs(["Inspector"]);

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      await initI18n();
      setIsI18nInitialized(true);
    };

    initializeI18n();
  }, []);

  if (!isI18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
