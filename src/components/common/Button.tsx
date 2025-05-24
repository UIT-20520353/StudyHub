import { FC, Key } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: FC<ButtonProps> = ({
  children,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
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
