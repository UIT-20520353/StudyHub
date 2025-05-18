import { ReactNode, useEffect, useRef } from "react";
import { Modal, View, TouchableWithoutFeedback, Animated } from "react-native";
import LottieView from "lottie-react-native";
import successAnimation from "../../assets/lottie/success-icon.json";
import errorAnimation from "../../assets/lottie/error-icon.json";

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  type?: "error" | "success";
}

export default function AnimatedModal({
  visible,
  onClose,
  children,
  type = "success",
}: AnimatedModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                width: "80%",
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <LottieView
                source={type === "success" ? successAnimation : errorAnimation}
                autoPlay
                loop
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
