import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";
import { colors } from "../../theme/colors";

interface FormFieldProps extends Omit<TextInputProps, "placeholder"> {
  label?: string;
  placeholder?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required = false,
  onFocus,
  onBlur,
  value,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const animatedBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, isFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorder, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    onBlur?.(e);
  };

  const labelTranslateY = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -12],
  });

  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: ["#94A3B8", error ? colors.common.red : colors.primary.main],
  });

  const borderColorValue = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.common.red : "#E2E8F0",
      error ? colors.common.red : colors.primary.main,
    ],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateY: labelTranslateY }],
              fontSize: labelFontSize,
              color: labelColor,
              left: leftIcon ? 44 : 16,
              opacity: 1,
            },
          ]}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColorValue,
            borderWidth: isFocused ? 2 : 1,
          },
          error && styles.errorBorder,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              error
                ? colors.common.red
                : isFocused
                ? colors.primary.main
                : "#94A3B8"
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor="#94A3B8"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          placeholder={isFocused ? placeholder : ""}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={
                error
                  ? colors.common.red
                  : isFocused
                  ? colors.primary.main
                  : "#94A3B8"
              }
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.common.red} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: "relative",
  },
  label: {
    position: "absolute",
    backgroundColor: colors.common.white,
    paddingHorizontal: 4,
    zIndex: 1,
    top: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.common.white,
    borderRadius: 12,
    minHeight: 56,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: fonts.openSans.regular,
  },
  inputWithLeftIcon: {
    paddingLeft: 44,
  },
  inputWithRightIcon: {
    paddingRight: 44,
  },
  leftIcon: {
    position: "absolute",
    left: 16,
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
  },
  errorBorder: {
    borderColor: colors.common.red,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.common.red,
    marginLeft: 4,
  },
  required: {
    color: colors.common.red,
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
  },
});
