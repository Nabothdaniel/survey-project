// src/components/ui/Alert.tsx
import React, { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
  duration?: number; // in ms
}

const Alert: React.FC<AlertProps> = ({ 
  type = "info", 
  message, 
  onClose, 
  duration = 3000 
}) => {
  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-600" />,
    error: <FiAlertTriangle className="w-5 h-5 text-red-600" />,
    info: <FiInfo className="w-5 h-5 text-blue-600" />,
  };

  // Auto close after `duration`
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`flex items-start gap-3 p-4 border-l-4 rounded-md shadow-sm transition-all ${styles[type]}`}
    >
      {icons[type]}
      <div className="flex-1 text-sm">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
