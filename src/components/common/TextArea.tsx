import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../theme/fonts";
import { colors } from "../../theme/colors";

interface TextAreaProps extends Omit<TextInputProps, "multiline"> {
  label?: string;
  placeholder?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  required?: boolean;
  minHeight?: number;
  maxHeight?: number;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  leftIcon,
  containerStyle,
  required = false,
  onFocus,
  onBlur,
  value,
  placeholder,
  minHeight = 120,
  maxHeight = 200,
  showCharacterCount = false,
  maxLength,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.border.light;
  };

  const getIconColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.text.disabled;
  };

  const characterCount = value?.length || 0;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, error && styles.labelError]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.textAreaContainer,
          {
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 2 : 1,
            minHeight,
            maxHeight,
          },
          error && styles.errorBorder,
        ]}
      >
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={getIconColor()}
              style={styles.leftIcon}
            />
          </View>
        )}

        <TextInput
          style={[styles.textArea, leftIcon && styles.textAreaWithIcon, style]}
          placeholderTextColor={colors.text.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          placeholder={placeholder}
          multiline={true}
          textAlignVertical="top"
          maxLength={maxLength}
          {...props}
        />
      </View>

      <View style={styles.bottomRow}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={colors.error.main} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
    color: colors.text.primary,
  },
  labelError: {
    color: colors.error.main,
  },
  required: {
    color: colors.error.main,
    fontSize: 14,
    fontFamily: fonts.openSans.medium,
  },
  textAreaContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    padding: 0,
  },
  iconContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  leftIcon: {
    // Icon positioning
  },
  textArea: {
    fontSize: 16,
    color: colors.text.primary,
    fontFamily: fonts.openSans.regular,
    padding: 16,
    lineHeight: 24,
    flex: 1,
  },
  textAreaWithIcon: {
    paddingLeft: 48,
  },
  errorBorder: {
    borderColor: colors.error.main,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.error.main,
    marginLeft: 4,
    flex: 1,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  characterCountError: {
    color: colors.error.main,
  },
});
