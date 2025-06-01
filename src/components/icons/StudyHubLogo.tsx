import React from "react";
import Svg, { Rect } from "react-native-svg";

interface StudyHubLogoProps {
  size?: number;
}

export const StudyHubLogo: React.FC<StudyHubLogoProps> = ({ size = 120 }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120">
    <Rect x="0" y="0" width="120" height="120" rx="30" ry="30" fill="#2563eb" />

    <Rect
      x="30"
      y="75"
      width="60"
      height="15"
      rx="3"
      ry="3"
      fill="#34d399"
      transform="rotate(-5 30 75)"
    />

    <Rect
      x="35"
      y="60"
      width="55"
      height="15"
      rx="3"
      ry="3"
      fill="#f97316"
      transform="rotate(3 35 60)"
    />

    <Rect
      x="40"
      y="45"
      width="50"
      height="15"
      rx="3"
      ry="3"
      fill="#e4f1fe"
      transform="rotate(-3 40 45)"
    />
  </Svg>
);
