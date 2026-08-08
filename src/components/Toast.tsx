import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
    error: <AlertCircle className="w-5 h-5 text-orange-500" />,
    info: <Info className="w-5 h-5 text-orange-500" />
  };

  const borders = {
    success: 'border-orange-500/50 bg-black',
    error: 'border-orange-500/50 bg-black',
    info: 'border-orange-500/50 bg-black'
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md max-w-md w-11/12 text-sm text-white animate-bounce-short ${borders[type]}`}>
      {icons[type]}
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="p-1 text-[#A0A0A0] hover:text-white rounded-lg">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
