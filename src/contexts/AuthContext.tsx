import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import AnimatedModal from "../components/common/AnimatedModal";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants/AppConstants";
import { authService, ILoginData } from "../services/authService";
import { IUser } from "../types/user";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";

interface AuthContextData {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInLoading: boolean;
  signIn: (values: ILoginData) => Promise<void>;
  signUp: (values: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation(NAMESPACES.API);

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (values: ILoginData) => {
    setSignInLoading(true);
    try {
      const { ok, body, errors } = await authService.login(values);

      if (ok && body) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, body.token);
        setUser(body.user);
      }

      if (errors) {
        setErrorMessage(errors.message);
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const signUp = async (values: any) => {
    // const { ok, body, errors } = await authService.login(values);
    // if (ok && body) {
    //   await AsyncStorage.setItem(AUTH_TOKEN_KEY, body.token);
    //   await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(body.user));
    // }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
    } catch (error) {
      throw new Error("Failed to sign out");
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signInLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
      <AnimatedModal
        visible={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        type="error"
      >
        <View>
          {errorMessage && (
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              {t(errorMessage)}
            </Text>
          )}
        </View>
      </AnimatedModal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
