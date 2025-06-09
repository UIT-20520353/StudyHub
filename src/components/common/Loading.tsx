import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../hooks";
import { NAMESPACES } from "../../i18n";
import { SafeAreaView } from "react-native-safe-area-context";

interface DotLoadingProps {
  color?: string;
  text?: string;
}

export const Loading: React.FC<DotLoadingProps> = ({
  color = "#2563EB",
  text,
}) => {
  const { t } = useTranslation(NAMESPACES.COMMON);

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnimation = (
      animatedValue: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createDotAnimation(dot1, 0);
    const animation2 = createDotAnimation(dot2, 200);
    const animation3 = createDotAnimation(dot3, 400);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.dotContainer}>
      <Text style={[styles.dotText, { color }]}>{text || t("loading")}</Text>
      <View style={styles.dotsWrapper}>
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              opacity: dot1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              opacity: dot2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              opacity: dot3,
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  dotText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  dotsWrapper: {
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});
