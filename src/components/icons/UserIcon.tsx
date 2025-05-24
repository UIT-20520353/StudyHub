import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { ViewStyle } from "react-native";

interface UserIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const UserIcon: React.FC<UserIconProps> = ({
  size = 24,
  color = "currentColor",
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <G
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <Path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" />
      <Path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6" />
    </G>
  </Svg>
);
