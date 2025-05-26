import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { Form } from "../../components/common/Form";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { colors } from "../../theme/colors";
import { RootStackNavigationProp } from "../../types/navigation";
import { Button } from "../../components/common/Button";
import { FormField } from "../../components/common/FormField";

type LoginScreenProps = {
  navigation: RootStackNavigationProp;
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
    await signIn(values);
    helpers.setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{authT("welcome_back")}</Text>
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
          <View>
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
              error={touched.password && errors.password ? errors.password : ""}
              leftIcon="lock-closed"
              label={authT("label.password")}
            />

            <Button onPress={() => handleSubmit()} disabled={signInLoading}>
              <Text style={styles.buttonText}>
                {signInLoading ? authT("logging_in") : authT("login")}
              </Text>
            </Button>
          </View>
        )}
      </Form>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Register")}
        disabled={signInLoading}
      >
        <Text style={styles.linkText}>
          {authT("no_account")} {authT("signup_now")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.background.default,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.button.primary.main,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: colors.button.primary.disabled,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary.main,
    fontSize: 16,
  },
});
