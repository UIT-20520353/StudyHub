import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import AnimatedModal from "../components/common/AnimatedModal";
import { AUTH_TOKEN_KEY } from "../constants/AppConstants";
import { authService, ILoginData } from "../services/authService";
import { IUser } from "../types/user";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import { Button } from "../components/common/Button";
import { colors } from "../theme/colors";

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

  const getProfile = async () => {
    const { ok, body, errors } = await authService.getProfile();
    if (ok && body) {
      setUser(body);
    }

    if (errors) {
      setErrorMessage(errors.message);
      await signOut();
    }
  };

  async function loadStoredData() {
    const token = await authService.getStoredToken();
    if (token) {
      await getProfile();
    }
    setLoading(false);
  }

  const signIn = async (values: ILoginData) => {
    setSignInLoading(true);
    const { ok, body, errors } = await authService.login(values);

    if (ok && body) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, body.token);
      await getProfile();
    }

    if (errors) {
      setErrorMessage(errors.message);
    }
    setSignInLoading(false);
  };

  const signUp = async (values: any) => {
    // Implementation for sign up
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
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
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          {errorMessage && (
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontFamily: "OpenSans_400Regular",
                color: colors.common.gray3,
              }}
            >
              {t(errorMessage)}
            </Text>
          )}
          <Button
            style={{ width: "100%" }}
            onPress={() => setErrorMessage(null)}
          >
            <Text
              style={{
                color: colors.common.white,
                fontFamily: "OpenSans_600SemiBold",
                fontSize: 16,
              }}
            >
              OK
            </Text>
          </Button>
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
