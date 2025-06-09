import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationBadge } from "./NotificationBadge";
import { colors } from "../../theme/colors";

interface NotificationIconProps {
  onPress?: () => void;
  unreadCount?: number;
  size?: number;
  color?: string;
  badgeSize?: "small" | "medium" | "large";
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  onPress,
  unreadCount = 0,
  size = 26,
  color = colors.text.primary,
  badgeSize = "small",
}) => {
  const IconComponent = onPress ? TouchableOpacity : View;

  return (
    <IconComponent
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <NotificationBadge count={unreadCount} size={badgeSize} />
      )}
    </IconComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 4, // Add padding to ensure badge doesn't get cut off
  },
});
