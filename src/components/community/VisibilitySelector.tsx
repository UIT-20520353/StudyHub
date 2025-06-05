import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ETopicVisibility } from "../../enums/topic";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { GlobeIcon, SchoolIcon } from "../icons";

interface VisibilityOption {
  value: ETopicVisibility;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface VisibilitySelectorProps {
  value: ETopicVisibility;
  onSelect: (visibility: ETopicVisibility) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  value,
  onSelect,
  error,
  label,
  required = false,
  disabled = false,
}) => {
  const visibilityOptions: VisibilityOption[] = [
    {
      value: ETopicVisibility.PUBLIC,
      label: "Công khai",
      description: "Mọi người đều có thể xem và tương tác",
      icon: <GlobeIcon size={24} color={colors.primary.main} />,
    },
    {
      value: ETopicVisibility.UNIVERSITY_ONLY,
      label: "Chỉ trường của tôi",
      description: "Chỉ sinh viên cùng trường mới có thể xem",
      icon: <SchoolIcon size={24} color={colors.secondary.main} />,
    },
  ];

  const handleSelect = (visibility: ETopicVisibility) => {
    if (!disabled) {
      onSelect(visibility);
    }
  };

  const renderVisibilityOption = (option: VisibilityOption) => {
    const isSelected = value === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.optionContainer,
          isSelected && styles.selectedOptionContainer,
          disabled && styles.disabledOptionContainer,
        ]}
        onPress={() => handleSelect(option.value)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionIcon}>{option.icon}</View>

          <View style={styles.optionTextContainer}>
            <Text
              style={[
                styles.optionLabel,
                isSelected && styles.selectedOptionLabel,
                disabled && styles.disabledText,
              ]}
            >
              {option.label}
            </Text>
            <Text
              style={[
                styles.optionDescription,
                disabled && styles.disabledText,
              ]}
            >
              {option.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View style={styles.optionsContainer}>
        {visibilityOptions.map(renderVisibilityOption)}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
  },
  required: {
    fontSize: 14,
    fontFamily: fonts.openSans.semiBold,
    color: colors.error.main,
    marginLeft: 4,
  },
  optionsContainer: {
    gap: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colors.input.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.input.border,
  },
  selectedOptionContainer: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  disabledOptionContainer: {
    backgroundColor: colors.input.disabled,
    borderColor: colors.input.disabledBorder,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.paper,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: fonts.openSans.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  selectedOptionLabel: {
    color: colors.text.primary,
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: fonts.openSans.regular,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  disabledText: {
    color: colors.text.disabled,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.openSans.regular,
    color: colors.error.main,
    marginTop: 8,
    marginLeft: 4,
  },
});
