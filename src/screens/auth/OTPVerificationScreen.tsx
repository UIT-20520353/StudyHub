import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
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
import MessageModal, {
  MessageModalProps,
} from "../../components/common/MessageModal";
import { StudyHubLogo } from "../../components/icons";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { authService } from "../../services/authService";
import { colors, withOpacity } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { AuthStackNavigationProp } from "../../types/navigation";
import { IUser } from "../../types/user";

type OTPVerificationScreenProps = {
  navigation: AuthStackNavigationProp;
  route: {
    params: {
      email: string;
      userId: number;
    };
  };
};

interface OTPFormValues {
  otp: string;
}

export default function OTPVerificationScreen({
  navigation,
  route,
}: OTPVerificationScreenProps) {
  const { t: authT } = useTranslation(NAMESPACES.AUTH);
  const { t: commonT } = useTranslation(NAMESPACES.COMMON);
  const { t: buttonT } = useTranslation(NAMESPACES.BUTTON);
  const { t: apiT } = useTranslation(NAMESPACES.API);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
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

  const { email, userId } = route.params;

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

  const sendVerificationEmail = async () => {
    setIsLoadingUser(true);
    const { ok, body, errors } = await authService.sendVerificationEmail(
      userId
    );
    if (ok) {
      setUser(body);
    } else {
      setErrorModalState((prev) => ({
        ...prev,
        message: apiT(errors.message),
        visible: true,
      }));
    }
    setIsLoadingUser(false);
  };

  const OTPSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, authT("validation.otp_format"))
      .required(authT("validation.otp_required")),
  });

  const handleVerifyOTP = async (
    values: OTPFormValues,
    helpers: any
  ): Promise<void> => {
    if (!user) return;

    setIsLoading(true);

    const { ok, errors } = await authService.verifyEmail({
      code: values.otp,
      userId: user.id,
    });

    if (ok) {
      setSuccessModalState((prev) => ({
        ...prev,
        message: apiT("success.verification.code.verified"),
        visible: true,
        backdropDismissible: false,
        onOk: () => {
          onCloseSuccessModal();
          navigation.navigate("Login");
        },
      }));
    } else {
      setErrorModalState((prev) => ({
        ...prev,
        message: apiT(errors.message),
        visible: true,
      }));
    }

    setIsLoading(false);
    helpers.setSubmitting(false);
  };

  const handleResendOTP = async (): Promise<void> => {
    if (!canResend) return;

    setIsResending(true);

    const { ok, errors } = await authService.resendVerificationEmail(userId);

    if (!ok) {
      setErrorModalState((prev) => ({
        ...prev,
        message: apiT(errors.message),
        visible: true,
      }));
    } else {
      setCanResend(false);
      setCountdown(60);
      startCountdown();
    }

    setIsResending(false);
  };

  const startCountdown = useCallback(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const maskEmail = (email: string): string => {
    if (!email || !email.includes("@")) return email;
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.substring(0, 2) + "*".repeat(Math.max(0, username.length - 2));
    return `${maskedUsername}@${domain}`;
  };

  useEffect(() => {
    const cleanup = startCountdown();
    return cleanup;
  }, [startCountdown]);

  useEffect(() => {
    sendVerificationEmail();
  }, [userId]);

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
          <MessageModal {...errorModalState} onClose={onCloseErrorModal} />
          <MessageModal {...successModalState} onClose={onCloseSuccessModal} />

          <View style={styles.languageSelectorContainer}>
            <LanguageSelector isDarkBackground={true} />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading || isLoadingUser}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <StudyHubLogo size={100} />
              </View>
            </View>
            <Text style={styles.appName}>StudyHub</Text>
            <Text style={styles.subtitle}>{authT("otp_subtitle")}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.title}>{authT("verify_account")}</Text>
              <Text style={styles.description}>{authT("otp_description")}</Text>
              <Text style={styles.emailText}>{maskEmail(email)}</Text>
            </View>

            <Form<OTPFormValues>
              initialValues={{ otp: "" }}
              validationSchema={OTPSchema}
              onSubmit={handleVerifyOTP}
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
                    placeholder={authT("placeholder.otp")}
                    value={values.otp}
                    onChangeText={handleChange("otp")}
                    onBlur={handleBlur("otp")}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!isLoading && !isLoadingUser}
                    error={touched.otp && errors.otp ? errors.otp : ""}
                    leftIcon="key"
                    label={authT("label.otp")}
                  />

                  <View style={styles.timerContainer}>
                    {!canResend ? (
                      <Text style={styles.timerText}>
                        {authT("resend_otp_in")} {formatTime(countdown)}
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={isResending}
                        style={styles.resendButton}
                      >
                        <Text style={styles.resendButtonText}>
                          {isResending
                            ? authT("sending_otp")
                            : authT("resend_otp")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      onPress={() => handleSubmit()}
                      disabled={
                        isLoading || values.otp.length !== 6 || isLoadingUser
                      }
                      style={[
                        styles.verifyButton,
                        (isLoading ||
                          values.otp.length !== 6 ||
                          isLoadingUser) &&
                          styles.disabledButton,
                      ]}
                    >
                      <View style={styles.buttonContent}>
                        {isLoading && <View style={styles.loadingIndicator} />}
                        <Text style={styles.buttonText}>
                          {isLoading ? authT("verifying") : authT("verify_otp")}
                        </Text>
                      </View>
                    </Button>
                  </View>
                </View>
              )}
            </Form>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>{authT("not_received_otp")}</Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={isLoading || isLoadingUser}
              >
                <Text style={styles.changeEmailText}>
                  {authT("change_email")}
                </Text>
              </TouchableOpacity>
            </View>
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
  backButtonText: {
    fontSize: 20,
    color: colors.common.white,
    fontFamily: fonts.openSans.bold,
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
    marginBottom: 12,
  },
  emailText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
    textAlign: "center",
  },
  formContent: {
    marginBottom: 24,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
  buttonContainer: {
    marginTop: 8,
  },
  verifyButton: {
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
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.1,
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
  footerContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  changeEmailText: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
});
