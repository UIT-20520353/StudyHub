import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import MessageModal, {
  MessageModalProps,
} from "../components/common/MessageModal";
import { AUTH_TOKEN_KEY } from "../constants/AppConstants";
import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";
import { RegisterFormValues } from "../screens/auth/RegisterScreen";
import { authService, ILoginData } from "../services/authService";
import { useAppDispatch } from "../store/hooks";
import { clearCart } from "../store/slices/cartSlice";
import { IUser } from "../types/user";

interface AuthContextData {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInLoading: boolean;
  signIn: (
    values: ILoginData,
    onVerified: (user: IUser) => void
  ) => Promise<void>;
  signUp: (
    values: RegisterFormValues,
    onSuccess: (user: IUser) => void
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signUpLoading: boolean;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation(NAMESPACES.API);
  const dispatch = useAppDispatch();
  const { t: commonT } = useTranslation(NAMESPACES.COMMON);
  const { t: buttonT } = useTranslation(NAMESPACES.BUTTON);

  const [errorModalState, setErrorModalState] = useState<MessageModalProps>({
    visible: false,
    message: "",
    type: "error",
    title: commonT("error_title"),
  });
  const [successModalState, setSuccessModalState] = useState<MessageModalProps>(
    {
      visible: false,
      message: "",
      type: "success",
      title: commonT("success_title"),
    }
  );
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [signUpLoading, setSignUpLoading] = useState<boolean>(false);
  const [pendingAuthentication, setPendingAuthentication] =
    useState<boolean>(false);

  const onCloseErrorModal = () => {
    setErrorModalState((prev) => ({
      ...prev,
      visible: false,
      okText: buttonT("ok"),
      onOk: undefined,
      backdropDismissible: true,
    }));
  };

  const onCloseSuccessModal = () => {
    setSuccessModalState((prev) => ({
      ...prev,
      visible: false,
      onOk: undefined,
      backdropDismissible: true,
    }));
  };

  const getProfile = async () => {
    const { ok, body, errors } = await authService.getProfile();
    if (ok && body) {
      setUser(body);
      setPendingAuthentication(false);
    }

    if (errors) {
      setErrorModalState((prev) => ({
        ...prev,
        message: t(errors.message),
        visible: true,
      }));

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

  const signUp = async (
    values: RegisterFormValues,
    onSuccess: (user: IUser) => void
  ) => {
    setSignUpLoading(true);

    const registerData = {
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      studentId: values.studentId || undefined,
      universityId: values.universityId,
      major: values.major || undefined,
      year: values.year ? parseInt(values.year) : undefined,
      phone: values.phone || undefined,
    };

    const { ok, body, errors } = await authService.register(registerData);

    if (ok) {
      onSuccess(body);
    } else {
      setErrorModalState((prev) => ({
        ...prev,
        message: t(errors.message),
        visible: true,
      }));
    }

    setSignUpLoading(false);
  };

  const signIn = async (
    values: ILoginData,
    onVerified: (user: IUser) => void
  ) => {
    setSignInLoading(true);
    const { ok, body, errors } = await authService.login(values);

    if (ok) {
      if (body.message === "error.account.not-verified") {
        setErrorModalState((prev) => ({
          ...prev,
          message: t(body.message),
          visible: true,
          okText: buttonT("verify"),
          onOk: () => {
            onVerified(body.user);
            onCloseErrorModal();
          },
        }));
      } else {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, body.token);
        setPendingAuthentication(true);

        setSuccessModalState((prev) => ({
          ...prev,
          message: t("success.login"),
          visible: true,
          backdropDismissible: false,
          onOk: async () => {
            onCloseSuccessModal();

            setTimeout(async () => {
              await getProfile();
            }, 300);
          },
        }));
      }
    } else {
      setErrorModalState((prev) => ({
        ...prev,
        message: t(errors.message),
        visible: true,
      }));
    }

    setSignInLoading(false);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setPendingAuthentication(false);
    dispatch(clearCart());
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !pendingAuthentication,
        loading: loading,
        signInLoading,
        signIn,
        signUp,
        signOut,
        signUpLoading,
        getProfile,
      }}
    >
      {children}

      <MessageModal {...successModalState} onClose={onCloseSuccessModal} />
      <MessageModal {...errorModalState} onClose={onCloseErrorModal} />
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
