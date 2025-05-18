import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../theme/colors";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({ children, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.button.primary.main,
  },
  buttonDisabled: {
    backgroundColor: colors.button.primary.disabled,
  },
});
