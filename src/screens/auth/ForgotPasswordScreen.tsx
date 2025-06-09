import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
import { useQuickToast, useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { authService } from "../../services/authService";
import { colors, withOpacity } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { AuthStackNavigationProp } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";

type ForgotPasswordScreenProps = {
  navigation: AuthStackNavigationProp;
};

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordScreen({
  navigation,
}: ForgotPasswordScreenProps) {
  const { t: authT } = useTranslation(NAMESPACES.AUTH);
  const { t: apiT } = useTranslation(NAMESPACES.API);
  const toast = useQuickToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(authT("validation.invalid_email"))
      .required(authT("validation.email_required")),
  });

  const handleForgotPassword = async (
    values: ForgotPasswordFormValues,
    helpers: any
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const { ok, errors } = await authService.forgotPassword(values.email);

      if (ok) {
        setEmailSent(true);
        toast.success(authT("forgot_password.email_sent"));
      } else {
        const errorMessage =
          apiT(errors.message) || authT("forgot_password.send_error");
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error(authT("forgot_password.send_error"));
    }

    setIsLoading(false);
    helpers.setSubmitting(false);
  };

  const handleResendEmail = async () => {
    toast.success(authT("forgot_password.email_resent"));
  };

  if (emailSent) {
    return (
      <LinearGradient
        colors={[
          colors.primary.main,
          colors.primary.dark,
          colors.secondary.dark,
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
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
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Ionicons
                    name="mail-outline"
                    size={64}
                    color={colors.status.success}
                  />
                </View>

                <Text style={styles.successTitle}>
                  {authT("forgot_password.email_sent_title")}
                </Text>

                <Text style={styles.successDescription}>
                  {authT("forgot_password.email_sent_description")}
                </Text>

                <View style={styles.instructionsContainer}>
                  <View style={styles.instructionItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.status.success}
                    />
                    <Text style={styles.instructionText}>
                      {authT("forgot_password.instruction_check")}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.status.success}
                    />
                    <Text style={styles.instructionText}>
                      {authT("forgot_password.instruction_click")}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.status.success}
                    />
                    <Text style={styles.instructionText}>
                      {authT("forgot_password.instruction_reset")}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsContainer}>
                  <Button
                    onPress={() => navigation.navigate("Login")}
                    style={styles.backToLoginButton}
                  >
                    <Text style={styles.backToLoginText}>
                      {authT("forgot_password.back_to_login")}
                    </Text>
                  </Button>

                  <TouchableOpacity
                    style={styles.resendContainer}
                    onPress={handleResendEmail}
                  >
                    <Text style={styles.resendText}>
                      {authT("forgot_password.not_received")}
                      <Text style={styles.resendLink}>
                        {" "}
                        {authT("forgot_password.resend")}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.common.white} />
          </TouchableOpacity>

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
              <View style={styles.titleContainer}>
                <Ionicons
                  name="key-outline"
                  size={32}
                  color={colors.primary.main}
                />
                <Text style={styles.title}>
                  {authT("forgot_password.title")}
                </Text>
              </View>
              <Text style={styles.description}>
                {authT("forgot_password.description")}
              </Text>
            </View>

            <Form<ForgotPasswordFormValues>
              initialValues={{ email: "" }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleForgotPassword}
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
                    editable={!isLoading}
                    error={touched.email && errors.email ? errors.email : ""}
                    leftIcon="mail"
                    label={authT("label.email")}
                    required
                  />

                  <View style={styles.infoContainer}>
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.infoText}>
                      {authT("forgot_password.info_text")}
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={() => handleSubmit()}
                      disabled={isLoading}
                      style={styles.sendButton}
                    >
                      <View style={styles.buttonContent}>
                        {isLoading && <View style={styles.loadingIndicator} />}
                        <Text style={styles.buttonText}>
                          {isLoading
                            ? authT("forgot_password.sending")
                            : authT("forgot_password.send_button")}
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
              )}
            </Form>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withOpacity(colors.common.white, 0.2),
    justifyContent: "center",
    alignItems: "center",
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  formContent: {
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  sendButton: {
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
  backToLoginContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  backToLoginLinkText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  backToLoginLink: {
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
  // Success State Styles
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: withOpacity(colors.status.success, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  instructionsContainer: {
    width: "100%",
    marginBottom: 32,
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
  actionsContainer: {
    width: "100%",
    gap: 16,
  },
  backToLoginButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backToLoginText: {
    color: colors.common.white,
    fontSize: 18,
    fontFamily: fonts.openSans.semiBold,
    letterSpacing: 0.5,
  },
  resendContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  resendLink: {
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
});
