import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { colors } from "../../theme/colors";

interface BuyIconProps {
  size?: number;
  color?: string;
}

export const BuyIcon: React.FC<BuyIconProps> = ({
  size = 24,
  color = colors.text.secondary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <G fill="none" stroke={color} strokeWidth="4">
      <Path strokeLinejoin="round" d="M6 15h36l-2 27H8z" clipRule="evenodd" />
      <Path strokeLinecap="round" strokeLinejoin="round" d="M16 19V6h16v13" />
      <Path strokeLinecap="round" d="M16 34h16" />
    </G>
  </Svg>
);
