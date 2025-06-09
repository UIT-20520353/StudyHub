import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IToastConfig, ToastType } from "../../types/toast";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

const { width: screenWidth } = Dimensions.get("window");

interface ToastMessageProps {
  toast: IToastConfig;
  onHide: (id: string) => void;
  index: number;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  toast,
  onHide,
  index,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: colors.status.success,
          iconName: "checkmark-circle" as const,
          borderColor: colors.status.success,
        };
      case "error":
        return {
          backgroundColor: colors.status.error,
          iconName: "close-circle" as const,
          borderColor: colors.status.error,
        };
      case "warning":
        return {
          backgroundColor: colors.status.warning,
          iconName: "warning" as const,
          borderColor: colors.status.warning,
        };
      case "info":
        return {
          backgroundColor: colors.status.info,
          iconName: "information-circle" as const,
          borderColor: colors.status.info,
        };
      default:
        return {
          backgroundColor: colors.status.info,
          iconName: "information-circle" as const,
          borderColor: colors.status.info,
        };
    }
  };

  const toastConfig = getToastConfig(toast.type);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);

        const progress = Math.min(
          Math.abs(gestureState.dx) / (screenWidth * 0.3),
          1
        );
        opacity.setValue(1 - progress * 0.3);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;

        const shouldDismiss =
          Math.abs(dx) > screenWidth * 0.3 || Math.abs(vx) > 0.8;

        if (shouldDismiss) {
          const targetX = dx > 0 ? screenWidth : -screenWidth;
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: targetX,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onHide(toast.id);
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 150,
              friction: 8,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: toast.position === "bottom" ? 100 : -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const handlePress = () => {
    if (toast.onPress) {
      toast.onPress();
    }
  };

  const handleClosePress = () => {
    hideToast();
  };

  const getPositionStyle = () => {
    const baseTop = toast.position === "bottom" ? undefined : 60;
    const baseBottom = toast.position === "bottom" ? 60 : undefined;

    return {
      top: baseTop ? baseTop + index * 80 : undefined,
      bottom: baseBottom ? baseBottom + index * 80 : undefined,
    };
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        {
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[
          styles.toastContent,
          { backgroundColor: toastConfig.backgroundColor + "F0" },
        ]}
        onPress={handlePress}
        activeOpacity={toast.onPress ? 0.8 : 1}
      >
        <View
          style={[
            styles.leftBorder,
            { backgroundColor: toastConfig.borderColor },
          ]}
        />

        <View style={styles.iconContainer}>
          <Ionicons
            name={toastConfig.iconName}
            size={24}
            color={colors.background.default}
          />
        </View>

        <View style={styles.textContainer}>
          {toast.title && (
            <Text style={styles.title} numberOfLines={1}>
              {toast.title}
            </Text>
          )}
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>

        {toast.showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={18}
              color={colors.background.default + "CC"}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <View style={styles.swipeIndicator} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.background.default + "20",
  },
  leftBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginLeft: 8,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.openSans.semiBold,
    fontSize: 14,
    color: colors.background.default,
    lineHeight: 18,
  },
  message: {
    fontFamily: fonts.openSans.regular,
    fontSize: 13,
    color: colors.background.default + "E6",
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  swipeIndicator: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.background.default + "30",
    borderRadius: 2,
  },
});
