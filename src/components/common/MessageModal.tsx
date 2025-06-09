import { ReactNode, useEffect, useRef } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import successAnimation from "../../assets/lottie/success-icon.json";
import errorAnimation from "../../assets/lottie/error-icon.json";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n";

export interface MessageModalProps {
  visible: boolean;
  onClose?: () => void;
  type?: "error" | "success" | "warning" | "info";
  title?: string;
  message: string | ReactNode;
  children?: ReactNode;

  // Button configurations
  showOkButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;

  // Button texts
  okText?: string;
  confirmText?: string;
  cancelText?: string;

  // Button actions
  onOk?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Style options
  backdropDismissible?: boolean;
  customIcon?: ReactNode;
}

export default function MessageModal({
  visible,
  onClose,
  type = "success",
  title,
  message,
  children,

  showOkButton = true,
  showConfirmButton = false,
  showCancelButton = false,

  okText,
  confirmText,
  cancelText,

  onOk,
  onConfirm,
  onCancel,

  backdropDismissible = true,
  customIcon,
}: MessageModalProps) {
  const { t } = useTranslation(NAMESPACES.BUTTON);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getAnimationSource = () => {
    switch (type) {
      case "success":
        return successAnimation;
      case "error":
        return errorAnimation;
      case "warning":
        return errorAnimation; // You can add warning animation
      case "info":
        return successAnimation; // You can add info animation
      default:
        return successAnimation;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
        return "#2196F3";
      default:
        return "#4CAF50";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
        return "#2196F3";
      default:
        return "#333";
    }
  };

  const handleBackdropPress = () => {
    if (backdropDismissible && onClose) {
      onClose();
    }
  };

  const handleOk = () => {
    if (onOk) {
      onOk();
    } else if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const renderButtons = () => {
    const buttons = [];

    if (showCancelButton) {
      buttons.push(
        <TouchableOpacity
          key="cancel"
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>
            {cancelText || t("cancel")}
          </Text>
        </TouchableOpacity>
      );
    }

    if (showConfirmButton) {
      buttons.push(
        <TouchableOpacity
          key="confirm"
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>
            {confirmText || t("confirm")}
          </Text>
        </TouchableOpacity>
      );
    }

    if (showOkButton && !showConfirmButton) {
      buttons.push(
        <TouchableOpacity
          key="ok"
          style={[
            styles.button,
            styles.okButton,
            { backgroundColor: getIconColor() },
          ]}
          onPress={handleOk}
          activeOpacity={0.8}
        >
          <Text style={styles.okButtonText}>{okText || t("ok")}</Text>
        </TouchableOpacity>
      );
    }

    return <View style={styles.buttonContainer}>{buttons}</View>;
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                {customIcon || (
                  <LottieView
                    source={getAnimationSource()}
                    autoPlay
                    loop={false}
                    style={styles.icon}
                  />
                )}
              </View>

              {/* Title */}
              {title && (
                <Text style={[styles.title, { color: getTitleColor() }]}>
                  {title}
                </Text>
              )}

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Custom children */}
              {children && (
                <View style={styles.childrenContainer}>{children}</View>
              )}

              {/* Buttons */}
              {renderButtons()}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 350,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  childrenContainer: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  okButton: {
    backgroundColor: "#4CAF50",
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#2196F3",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const useMessageModal = () => {
  const showSuccess = (
    message: string,
    options?: Partial<MessageModalProps>
  ) => {
    return {
      visible: true,
      type: "success" as const,
      message,
      ...options,
    };
  };

  const showError = (message: string, options?: Partial<MessageModalProps>) => {
    return {
      visible: true,
      type: "error" as const,
      message,
      ...options,
    };
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    options?: Partial<MessageModalProps>
  ) => {
    return {
      visible: true,
      type: "info" as const,
      message,
      showOkButton: false,
      showConfirmButton: true,
      showCancelButton: true,
      onConfirm,
      ...options,
    };
  };

  return {
    showSuccess,
    showError,
    showConfirm,
  };
};
