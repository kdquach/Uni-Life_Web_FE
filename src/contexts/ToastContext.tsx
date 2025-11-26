import { createContext, useState, ReactNode, useCallback } from "react";
import Toast, { ToastType } from "../components/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const MAX_TOASTS = 3; // Giới hạn tối đa 3 toast cùng lúc

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = Date.now();
      setToasts((prev) => {
        const newToasts = [...prev, { id, message, type, duration }];
        // Giữ chỉ MAX_TOASTS toast mới nhất
        return newToasts.slice(-MAX_TOASTS);
      });
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration: number = 3000) => {
      showToast(message, "success", duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration: number = 3000) => {
      showToast(message, "error", duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration: number = 3000) => {
      showToast(message, "warning", duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration: number = 3000) => {
      showToast(message, "info", duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{ marginTop: index > 0 ? "0.75rem" : "0" }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
