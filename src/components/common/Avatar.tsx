// src/components/common/Avatar.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ImageStyle,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";

interface AvatarProps {
  source?: string;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  style?: ViewStyle | ImageStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 32,
  borderWidth = 1,
  borderColor = colors.avatar.border,
  backgroundColor = colors.avatar.background,
  style,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);

  // Animation values
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Shimmer loading animation
  useEffect(() => {
    if (!showImage) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [showImage, shimmerAnimation]);

  // Fade in animation when image loads
  useEffect(() => {
    if (imageLoaded && !imageError) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowImage(true);
      });
    }
  }, [imageLoaded, imageError, fadeAnimation]);

  // Reset states when source changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setShowImage(false);
    fadeAnimation.setValue(0);
  }, [source, fadeAnimation]);

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <View
      style={[
        styles.container,
        avatarSize,
        {
          borderWidth,
          borderColor,
          backgroundColor,
        },
        style,
      ]}
    >
      {/* Loading shimmer animation - FULL SIZE */}
      {!showImage && (
        <Animated.View
          style={[
            styles.shimmerOverlay,
            avatarSize,
            {
              opacity: shimmerOpacity,
            },
          ]}
        />
      )}

      {source && !imageError && (
        <Animated.View
          style={[
            styles.imageContainer,
            avatarSize,
            {
              opacity: showImage ? 1 : fadeAnimation,
            },
          ]}
        >
          <Image
            source={{ uri: source }}
            style={[styles.image, avatarSize]}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="cover"
          />
        </Animated.View>
      )}

      {(!source || imageError) && (
        <Animated.View
          style={[
            styles.fallback,
            avatarSize,
            {
              opacity: shimmerOpacity,
            },
          ]}
        ></Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.common.gray2,
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  fallback: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.common.gray2,
  },
});
