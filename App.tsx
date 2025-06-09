import React, { useEffect, useState } from "react";
import { ActivityIndicator, LogBox, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { ToastContainer } from "./src/components/common/ToastContainer";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import initI18n from "./src/i18n";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store";

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
    <Provider store={store}>
      <ToastProvider maxToasts={3}>
        <AuthProvider>
          <SafeAreaProvider>
            <AppNavigator />

            <ToastContainer />
          </SafeAreaProvider>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}
