import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const ToastNotification = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${message.includes("Erro") ? "error" : "success"}`}>
      {message}
      <button onClick={onClose} className="toast-close">
        ×
      </button>
    </div>
  );
};
