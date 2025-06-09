export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition = "top" | "bottom" | "center";

export interface IToastConfig {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  showCloseButton?: boolean;
  onPress?: () => void;
  onClose?: () => void;
}

export interface IToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  position?: ToastPosition;
  showCloseButton?: boolean;
  onPress?: () => void;
  onClose?: () => void;
}
