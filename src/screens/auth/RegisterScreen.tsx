import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { UniversitySelector } from "../../components/auth/UniversitySelector";
import { Button } from "../../components/common/Button";
import { Form } from "../../components/common/Form";
import { FormField } from "../../components/common/FormField";
import { LanguageSelector } from "../../components/common/LanguageSelector";
import { StudyHubLogo } from "../../components/icons";
import { EUniversityStatus } from "../../enums/university";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { universityService } from "../../services/universityService";
import { colors, withOpacity } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { RootStackNavigationProp } from "../../types/navigation";
import { IUniversity } from "../../types/university";

type RegisterScreenProps = {
  navigation: RootStackNavigationProp;
};

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  studentId: string | undefined;
  university: IUniversity | null;
  major: string | undefined;
  year: string | undefined;
  phone: string | undefined;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { t: authT } = useTranslation(NAMESPACES.AUTH);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [universities, setUniversities] = useState<IUniversity[]>([]);

  const getUniversities = useCallback(async () => {
    const { body, errors, ok } = await universityService.getUniversities();
    if (ok) {
      setUniversities(body);
    } else {
      console.error(errors);
      setUniversities([]);
    }
  }, []);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email(authT("validation.invalid_email"))
      .required(authT("validation.email_required")),
    password: Yup.string()
      .min(6, authT("validation.password_min_length"))
      .required(authT("validation.password_required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], authT("validation.password_not_match"))
      .required(authT("validation.confirm_password_required")),
    fullName: Yup.string().required(authT("validation.full_name_required")),
    university: Yup.object()
      .shape({
        id: Yup.number().required(),
        name: Yup.string().required(),
        shortName: Yup.string().required(),
        address: Yup.string().required(),
        emailDomain: Yup.string().required(),
        city: Yup.string().required(),
        website: Yup.string().required(),
        logoUrl: Yup.string().required(),
        description: Yup.string().required(),
        status: Yup.string().oneOf(Object.values(EUniversityStatus)).required(),
        isActive: Yup.boolean().required(),
        createdAt: Yup.string().required(),
        updatedAt: Yup.string().required(),
      })
      .nullable()
      .required(authT("validation.university_required")),
    studentId: Yup.string(),
    major: Yup.string(),
    year: Yup.string().matches(/^\d{0,4}$/, authT("validation.year_format")),
    phone: Yup.string().matches(
      /^[0-9+\-\s()]*$/,
      authT("validation.phone_format")
    ),
  });

  const handleRegister = async (
    values: RegisterFormValues,
    helpers: any
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const registerData = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        studentId: values.studentId || undefined,
        universityId: values.university?.id,
        major: values.major || undefined,
        year: values.year ? parseInt(values.year) : undefined,
        phone: values.phone || undefined,
      };

      console.log("Register data:", registerData);

      // Navigate to login or main app
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      helpers.setSubmitting(false);
    }
  };

  useEffect(() => {
    getUniversities();
  }, [getUniversities]);

  return (
    <LinearGradient
      colors={[colors.primary.main, colors.primary.dark, colors.secondary.dark]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
              <Text style={styles.subtitle}>{authT("register_subtitle")}</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.title}>{authT("create_account")}</Text>
                <Text style={styles.description}>
                  {authT("register_description")}
                </Text>
              </View>

              <Form<RegisterFormValues>
                initialValues={{
                  email: "",
                  password: "",
                  confirmPassword: "",
                  fullName: "",
                  studentId: "",
                  university: null,
                  major: "",
                  year: "",
                  phone: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View style={styles.formContent}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        {authT("personal_information")}
                      </Text>
                    </View>

                    <FormField
                      placeholder={authT("placeholder.full_name")}
                      value={values.fullName}
                      onChangeText={handleChange("fullName")}
                      onBlur={handleBlur("fullName")}
                      editable={!isLoading}
                      error={
                        touched.fullName && errors.fullName
                          ? errors.fullName
                          : ""
                      }
                      leftIcon="person"
                      label={authT("label.full_name")}
                      required
                    />

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

                    <FormField
                      placeholder={authT("placeholder.phone")}
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      keyboardType="phone-pad"
                      editable={!isLoading}
                      error={touched.phone && errors.phone ? errors.phone : ""}
                      leftIcon="call"
                      label={authT("label.phone")}
                    />

                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        {authT("account_security")}
                      </Text>
                    </View>

                    <FormField
                      placeholder={authT("placeholder.password")}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry
                      editable={!isLoading}
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : ""
                      }
                      leftIcon="lock-closed"
                      label={authT("label.password")}
                      required
                    />

                    <FormField
                      placeholder={authT("placeholder.confirm_password")}
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry
                      editable={!isLoading}
                      error={
                        touched.confirmPassword && errors.confirmPassword
                          ? errors.confirmPassword
                          : ""
                      }
                      leftIcon="lock-closed"
                      label={authT("label.confirm_password")}
                      required
                    />

                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        {authT("academic_information")}
                      </Text>
                    </View>

                    <UniversitySelector
                      value={values.university}
                      onSelect={(university) =>
                        setFieldValue("university", university)
                      }
                      placeholder={authT("placeholder.university")}
                      error={
                        touched.university && errors.university
                          ? errors.university
                          : ""
                      }
                      label={authT("label.university")}
                      universities={universities}
                      required
                    />

                    <FormField
                      placeholder={authT("placeholder.student_id")}
                      value={values.studentId}
                      onChangeText={handleChange("studentId")}
                      onBlur={handleBlur("studentId")}
                      editable={!isLoading}
                      error={
                        touched.studentId && errors.studentId
                          ? errors.studentId
                          : ""
                      }
                      leftIcon="card"
                      label={authT("label.student_id")}
                    />

                    <FormField
                      placeholder={authT("placeholder.major")}
                      value={values.major}
                      onChangeText={handleChange("major")}
                      onBlur={handleBlur("major")}
                      editable={!isLoading}
                      error={touched.major && errors.major ? errors.major : ""}
                      leftIcon="school"
                      label={authT("label.major")}
                    />

                    <FormField
                      placeholder={authT("placeholder.year")}
                      value={values.year}
                      onChangeText={handleChange("year")}
                      onBlur={handleBlur("year")}
                      keyboardType="numeric"
                      editable={!isLoading}
                      error={touched.year && errors.year ? errors.year : ""}
                      leftIcon="calendar"
                      label={authT("label.year")}
                    />

                    <View style={styles.buttonContainer}>
                      <Button
                        onPress={() => handleSubmit()}
                        disabled={isLoading}
                        style={styles.registerButton}
                      >
                        <View style={styles.buttonContent}>
                          {isLoading && (
                            <View style={styles.loadingIndicator} />
                          )}
                          <Text style={styles.buttonText}>
                            {isLoading
                              ? authT("creating_account")
                              : authT("create_account")}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  </View>
                )}
              </Form>

              <TouchableOpacity
                style={styles.signInContainer}
                onPress={() => navigation.navigate("Login")}
                disabled={isLoading}
              >
                <Text style={styles.signInText}>
                  {authT("have_account")}
                  <Text style={styles.signInLink}> {authT("signin_now")}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginTop: 60,
    marginBottom: 30,
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
    fontSize: 28,
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
    marginBottom: 20,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.openSans.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    textAlign: "center",
  },
  formContent: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  buttonContainer: {
    marginTop: 24,
  },
  registerButton: {
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
  signInContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  signInText: {
    fontSize: 16,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
  },
  signInLink: {
    fontFamily: fonts.openSans.semiBold,
    color: colors.primary.main,
  },
});
