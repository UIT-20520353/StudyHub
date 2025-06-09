import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { IToastConfig, IToastOptions } from "../types/toast";

interface IToastContext {
  toasts: IToastConfig[];
  showToast: (message: string, options?: IToastOptions) => string;
  showSuccess: (
    message: string,
    options?: Omit<IToastOptions, "type">
  ) => string;
  showError: (message: string, options?: Omit<IToastOptions, "type">) => string;
  showWarning: (
    message: string,
    options?: Omit<IToastOptions, "type">
  ) => string;
  showInfo: (message: string, options?: Omit<IToastOptions, "type">) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<IToastContext | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 3,
}) => {
  const [toasts, setToasts] = useState<IToastConfig[]>([]);

  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback(
    (message: string, options?: IToastOptions): string => {
      const id = generateId();

      const newToast: IToastConfig = {
        id,
        type: options?.type || "info",
        title: options?.title,
        message,
        duration: options?.duration || 3000,
        position: options?.position || "top",
        showCloseButton: options?.showCloseButton !== false,
        onPress: options?.onPress,
        onClose: options?.onClose,
      };

      setToasts((prevToasts) => {
        const updatedToasts = [newToast, ...prevToasts];
        // Limit the number of toasts
        return updatedToasts.slice(0, maxToasts);
      });

      // Auto hide after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [generateId, maxToasts]
  );

  const showSuccess = useCallback(
    (message: string, options?: Omit<IToastOptions, "type">): string => {
      return showToast(message, { ...options, type: "success" });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options?: Omit<IToastOptions, "type">): string => {
      return showToast(message, { ...options, type: "error" });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: Omit<IToastOptions, "type">): string => {
      return showToast(message, { ...options, type: "warning" });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: Omit<IToastOptions, "type">): string => {
      return showToast(message, { ...options, type: "info" });
    },
    [showToast]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => {
      const toastToHide = prevToasts.find((toast) => toast.id === id);
      if (toastToHide?.onClose) {
        toastToHide.onClose();
      }
      return prevToasts.filter((toast) => toast.id !== id);
    });
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts((prevToasts) => {
      prevToasts.forEach((toast) => {
        if (toast.onClose) {
          toast.onClose();
        }
      });
      return [];
    });
  }, []);

  const value: IToastContext = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export const useToast = (): IToastContext => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
