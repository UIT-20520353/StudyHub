import React from "react";
import Svg, { Path } from "react-native-svg";
import { ViewStyle } from "react-native";

interface ArrowRightIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
  size = 24,
  color = "currentColor",
  style,
}) => (
  <Svg width={size} height={size} viewBox="0 0 12 24" style={style}>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
    />
  </Svg>
);
