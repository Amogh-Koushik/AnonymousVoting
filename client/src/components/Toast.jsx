// ============================================================
// Toast Notification Component
// Displays success/error/info messages with auto-dismiss
// ============================================================

import { useState, useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <HiCheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <HiXCircle className="w-5 h-5 text-red-400" />,
    info: <HiInformationCircle className="w-5 h-5 text-primary-400" />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-primary-500/10 border-primary-500/30',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl
        transition-all duration-300
        ${bgColors[type]}
        ${isVisible ? 'animate-slide-down opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      {icons[type]}
      <p className="text-sm font-medium text-white max-w-xs">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-dark-400 hover:text-white transition-colors"
      >
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
