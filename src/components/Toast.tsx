import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    iconColor: "text-green-500",
    textColor: "text-green-800",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    iconColor: "text-red-500",
    textColor: "text-red-800",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    iconColor: "text-yellow-500",
    textColor: "text-yellow-800",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    iconColor: "text-blue-500",
    textColor: "text-blue-800",
  },
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-start gap-3 ${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md animate-slide-in`}
    >
      <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p
          className={`${config.textColor} font-semibold text-sm leading-relaxed`}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
