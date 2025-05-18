import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../../theme/colors";

interface FormFieldProps extends TextInputProps {
  error?: string;
  touched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  error,
  touched,
  style,
  ...props
}) => {
  return (
    <View>
      <TextInput
        style={[styles.input, touched && error && styles.inputError, style]}
        {...props}
      />
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});
