import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { EProductCondition } from "../../enums/product";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";

interface ProductConditionBadgeProps {
  condition: EProductCondition;
  style?: StyleProp<ViewStyle>;
}

export const ProductConditionBadge: React.FC<ProductConditionBadgeProps> = ({
  condition,
  style,
}) => {
  const { t } = useTranslation(NAMESPACES.MARKETPLACE);

  const getConditionLabel = (condition: EProductCondition): string => {
    switch (condition) {
      case EProductCondition.NEW:
        return t("condition.new");
      case EProductCondition.LIKE_NEW:
        return t("condition.like_new");
      case EProductCondition.GOOD:
        return t("condition.good");
      case EProductCondition.FAIR:
        return t("condition.fair");
      case EProductCondition.POOR:
        return t("condition.poor");
      default:
        return t("condition.unknown");
    }
  };

  const getConditionColor = (condition: EProductCondition): string => {
    switch (condition) {
      case EProductCondition.NEW:
        return colors.status.success;
      case EProductCondition.LIKE_NEW:
        return colors.status.info;
      case EProductCondition.GOOD:
        return colors.status.warning;
      case EProductCondition.FAIR:
        return colors.status.warning;
      case EProductCondition.POOR:
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <View
      style={[
        styles.conditionBadge,
        {
          backgroundColor: getConditionColor(condition) + "20",
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.conditionText,
          {
            color: getConditionColor(condition),
          },
        ]}
      >
        {getConditionLabel(condition)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  conditionText: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 12,
  },
});
