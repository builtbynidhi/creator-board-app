import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-600/25">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-emerald-500 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
