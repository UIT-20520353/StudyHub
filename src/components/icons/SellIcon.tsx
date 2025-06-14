import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";

interface SellIconProps {
  size?: number;
  color?: string;
}

export const SellIcon: React.FC<SellIconProps> = ({
  size = 24,
  color = colors.text.secondary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="m21.4 14.25l-7.15 7.15q-.3.3-.675.45t-.75.15t-.75-.15t-.675-.45l-8.825-8.825q-.275-.275-.425-.637T2 11.175V4q0-.825.588-1.412T4 2h7.175q.4 0 .775.163t.65.437l8.8 8.825q.3.3.438.675t.137.75t-.137.738t-.438.662M12.825 20l7.15-7.15L11.15 4H4v7.15zM6.5 8q.625 0 1.063-.437T8 6.5t-.437-1.062T6.5 5t-1.062.438T5 6.5t.438 1.063T6.5 8m5.5 4"
    />
  </Svg>
);
