import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Button } from "../../components/common/Button";
import { Form } from "../../components/common/Form";
import { FormField } from "../../components/common/FormField";
import { LanguageSelector } from "../../components/common/LanguageSelector";
import { StudyHubLogo } from "../../components/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { colors, withOpacity } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { AuthStackNavigationProp } from "../../types/navigation";
import { IUser } from "../../types/user";

type LoginScreenProps = {
  navigation: AuthStackNavigationProp;
};

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn, signInLoading } = useAuth();
  const { t: authT } = useTranslation(NAMESPACES.AUTH);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(authT("validation.invalid_email"))
      .required(authT("validation.email_required")),
    password: Yup.string()
      .min(6, authT("validation.password_min_length"))
      .required(authT("validation.password_required")),
  });

  const handleLogin = async (
    values: LoginFormValues,
    helpers: any
  ): Promise<void> => {
    await signIn(values, (user: IUser) => {
      navigation.navigate("OTPVerification", {
        email: user.email,
        userId: user.id,
      });
    });
    helpers.setSubmitting(false);
  };

  return (
    <LinearGradient
      colors={[colors.primary.main, colors.primary.dark, colors.secondary.dark]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector isDarkBackground={true} />
          </View>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <StudyHubLogo size={100} />
              </View>
            </View>
            <Text style={styles.appName}>StudyHub</Text>
            <Text style={styles.subtitle}>{authT("subtitle")}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.title}>{authT("welcome_back")}</Text>
              <Text style={styles.description}>
                {authT("login_description")}
              </Text>
            </View>

            <Form<LoginFormValues>
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.formContent}>
                  <FormField
                    placeholder={authT("placeholder.email")}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!signInLoading}
                    error={touched.email && errors.email ? errors.email : ""}
                    leftIcon="mail"
                    label={authT("label.email")}
                  />

                  <FormField
                    placeholder={authT("placeholder.password")}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry
                    editable={!signInLoading}
                    error={
                      touched.password && errors.password ? errors.password : ""
                    }
                    leftIcon="lock-closed"
                    label={authT("label.password")}
                  />

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      {authT("forgot_password")}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={() => handleSubmit()}
                      disabled={signInLoading}
                      style={styles.loginButton}
                    >
                      <View style={styles.buttonContent}>
                        {signInLoading && (
                          <View style={styles.loadingIndicator} />
                        )}
                        <Text style={styles.buttonText}>
                          {signInLoading ? authT("logging_in") : authT("login")}
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
              )}
            </Form>

            {/* Sign Up Link */}
            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={() => navigation.navigate("Register")}
              disabled={signInLoading}
            >
              <Text style={styles.signUpText}>
                {authT("no_account")}
                <Text style={styles.signUpLink}> {authT("signup_now")}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.common.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontFamily: fonts.openSans.bold,
    color: colors.common.white,
    marginBottom: 8,
    textShadowColor: withOpacity(colors.common.black, 0.3),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: withOpacity(colors.common.white, 0.9),
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },
  formContent: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.primary.main,
  },
  buttonContainer: {
    marginTop: 8,
  },
  loginButton: {
    height: 56,
    borderRadius: 16,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.common.white,
    borderTopColor: "transparent",
    marginRight: 12,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    letterSpacing: 0.5,
  },
  signUpContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  signUpText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  signUpLink: {
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
});
