import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";

interface CommentIconProps {
  size?: number;
  color?: string;
}

export const CommentIcon: React.FC<CommentIconProps> = ({
  size = 24,
  color = colors.text.secondary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12.36 4C6.58 4 2.644 9.857 4.824 15.21l.933 2.288a.5.5 0 0 1-.15.579L3.634 19.66a.5.5 0 0 0 .313.89h7.82a8.73 8.73 0 0 0 8.733-8.732C20.5 7.5 17 4 12.682 4z"
    />
  </Svg>
);
