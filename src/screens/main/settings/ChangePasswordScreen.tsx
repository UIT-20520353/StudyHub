import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Button } from "../../../components/common/Button";
import { Form } from "../../../components/common/Form";
import { FormField } from "../../../components/common/FormField";
import { StackNavigationHeader } from "../../../components/common/StackNavigationHeader";
import { useQuickToast, useTranslation } from "../../../hooks";
import { NAMESPACES } from "../../../i18n";
import { userService } from "../../../services/user";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";

interface ChangePasswordScreenProps {
  navigation: any;
}

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const createChangePasswordSchema = () =>
  Yup.object().shape({
    currentPassword: Yup.string()
      .required("Vui lòng nhập mật khẩu hiện tại")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    newPassword: Yup.string()
      .required("Vui lòng nhập mật khẩu mới")
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .test(
        "different-from-current",
        "Mật khẩu mới phải khác mật khẩu hiện tại",
        function (value) {
          return value !== this.parent.currentPassword;
        }
      ),
    confirmPassword: Yup.string()
      .required("Vui lòng xác nhận mật khẩu mới")
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
  });

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation(NAMESPACES.PROFILE);
  const { t: tApi } = useTranslation(NAMESPACES.API);
  const toast = useQuickToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (
    values: ChangePasswordFormValues,
    helpers: any
  ): Promise<void> => {
    setIsLoading(true);

    const { ok, errors } = await userService.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (ok) {
      toast.success(t("password.change_success"));
      helpers.resetForm();
      navigation.goBack();
    } else {
      const errorMessage =
        tApi(errors.message) || tApi("password.change_error");

      toast.error(errorMessage);
    }

    setIsLoading(false);
    helpers.setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StackNavigationHeader
        title={t("change_password")}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Ionicons
                  name="shield-checkmark"
                  size={48}
                  color={colors.primary.main}
                />
                <Text style={styles.infoTitle}>
                  {t("password.security_title")}
                </Text>
                <Text style={styles.infoDescription}>
                  {t("password.security_description")}
                </Text>
              </View>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>
                {t("password.requirements_title")}
              </Text>
              <View style={styles.requirementsList}>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.status.success}
                  />
                  <Text style={styles.requirementText}>
                    {t("password.requirement_length")}
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.status.success}
                  />
                  <Text style={styles.requirementText}>
                    {t("password.requirement_different")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Form<ChangePasswordFormValues>
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={createChangePasswordSchema()}
                onSubmit={handleChangePassword}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <View style={styles.formContainer}>
                    <FormField
                      label={t("password.current_password")}
                      placeholder={t("password.current_password_placeholder")}
                      value={values.currentPassword}
                      onChangeText={handleChange("currentPassword")}
                      onBlur={handleBlur("currentPassword")}
                      leftIcon="lock-closed"
                      rightIcon={showCurrentPassword ? "eye-off" : "eye"}
                      onRightIconPress={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      secureTextEntry={!showCurrentPassword}
                      editable={!isSubmitting && !isLoading}
                      error={
                        touched.currentPassword && errors.currentPassword
                          ? errors.currentPassword
                          : ""
                      }
                      required
                    />

                    <FormField
                      label={t("password.new_password")}
                      placeholder={t("password.new_password_placeholder")}
                      value={values.newPassword}
                      onChangeText={handleChange("newPassword")}
                      onBlur={handleBlur("newPassword")}
                      leftIcon="lock-closed"
                      rightIcon={showNewPassword ? "eye-off" : "eye"}
                      onRightIconPress={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                      secureTextEntry={!showNewPassword}
                      editable={!isSubmitting && !isLoading}
                      error={
                        touched.newPassword && errors.newPassword
                          ? errors.newPassword
                          : ""
                      }
                      required
                    />

                    <FormField
                      label={t("password.confirm_password")}
                      placeholder={t("password.confirm_password_placeholder")}
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      leftIcon="lock-closed"
                      rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                      onRightIconPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      secureTextEntry={!showConfirmPassword}
                      editable={!isSubmitting && !isLoading}
                      error={
                        touched.confirmPassword && errors.confirmPassword
                          ? errors.confirmPassword
                          : ""
                      }
                      required
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting || isLoading}
                        style={styles.submitButton}
                      >
                        <View style={styles.buttonContent}>
                          {(isSubmitting || isLoading) && (
                            <View style={styles.loadingIndicator} />
                          )}
                          <Text style={styles.buttonText}>
                            {isSubmitting || isLoading
                              ? t("password.changing")
                              : t("password.change_button")}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  </View>
                )}
              </Form>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  infoSection: {
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: colors.background.default,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  requirementsSection: {
    backgroundColor: colors.background.default,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    flex: 1,
  },
  formSection: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: colors.background.default,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
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
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    letterSpacing: 0.5,
  },
});

export default ChangePasswordScreen;
