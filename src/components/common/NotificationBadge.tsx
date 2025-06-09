import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface NotificationBadgeProps {
  count: number;
  size?: "small" | "medium" | "large";
  showZero?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = "medium",
  showZero = false,
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const getBadgeSize = () => {
    switch (size) {
      case "small":
        return {
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          fontSize: 10,
        };
      case "large":
        return {
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          fontSize: 12,
        };
      default: // medium
        return {
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          fontSize: 11,
        };
    }
  };

  const badgeSize = getBadgeSize();
  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <View
      style={[
        styles.badge,
        {
          minWidth: badgeSize.minWidth,
          height: badgeSize.height,
          borderRadius: badgeSize.borderRadius,
        },
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: badgeSize.fontSize }]}>
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.status.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    position: "absolute",
    top: -6,
    right: -6,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: colors.common.white,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
});
