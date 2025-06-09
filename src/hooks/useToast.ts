import { useToast as useToastContext } from "../contexts/ToastContext";

export const useToast = useToastContext;

export const useQuickToast = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToastContext();

  return {
    success: (message: string, title?: string) => {
      showSuccess(message, { title, duration: 3000 });
    },

    error: (message: string, title?: string) => {
      showError(message, { title: title || "Lỗi", duration: 5000 });
    },

    warning: (message: string, title?: string) => {
      showWarning(message, { title: title || "Cảnh báo", duration: 4000 });
    },

    info: (message: string, title?: string) => {
      showInfo(message, { title, duration: 3000 });
    },

    successWithAction: (
      message: string,
      action: () => void,
      actionTitle?: string
    ) => {
      showSuccess(message, {
        title: actionTitle || "Thành công",
        duration: 4000,
        onPress: action,
      });
    },

    persistent: (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      const toastFn =
        type === "success"
          ? showSuccess
          : type === "error"
          ? showError
          : type === "warning"
          ? showWarning
          : showInfo;

      return toastFn(message, {
        duration: 0,
        showCloseButton: true,
      });
    },
  };
};
