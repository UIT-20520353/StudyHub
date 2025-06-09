import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

interface BadgeProps {
  count: number;
}

export const Badge: React.FC<BadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.status.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  text: {
    color: colors.background.default,
    fontSize: 10,
    fontFamily: fonts.openSans.semiBold,
  },
});
