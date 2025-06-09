import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../contexts/ToastContext";
import { ToastMessage } from "./ToastMessage";

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast, index) => (
        <ToastMessage
          key={toast.id}
          toast={toast}
          onHide={hideToast}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
