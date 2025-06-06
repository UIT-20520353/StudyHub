import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";

interface LikeIconProps {
  size?: number;
  color?: string;
}

export const LikeIcon: React.FC<LikeIconProps> = ({
  size = 24,
  color = colors.text.secondary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73zM1 21h4V9H1z"
    />
  </Svg>
);
