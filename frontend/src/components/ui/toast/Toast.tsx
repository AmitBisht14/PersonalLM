import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all transform animate-slide-down ${
          type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
        role="alert"
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : (
          <XCircle className="w-5 h-5 text-white" />
        )}
        <p className="text-white">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
