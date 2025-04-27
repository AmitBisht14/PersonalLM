import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // match fade-out duration
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500/90 to-emerald-600/90';
      case 'error':
        return 'bg-gradient-to-r from-red-500/90 to-rose-600/90';
      case 'info':
        return 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90';
      default:
        return 'bg-gray-700/90';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-white drop-shadow" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-white drop-shadow" />;
      case 'info':
        return <Info className="w-5 h-5 text-white drop-shadow" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      style={{ minWidth: 280, maxWidth: 360 }}
    >
      <div
        className={`flex items-center gap-3 px-5 h-10 rounded-2xl shadow-2xl ring-1 ring-white/10 backdrop-blur-md ${getBackgroundColor()} relative`}
        role="alert"
        style={{ minHeight: 36, maxHeight: 40 }}
      >
        {getIcon()}
        <span className="text-white text-sm font-medium w-0 flex-1 truncate drop-shadow-sm" title={message}>{message}</span>
        <button
          className="p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          aria-label="Close toast"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
