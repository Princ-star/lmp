import React from 'react';

/**
 * ToastModal Component
 * Replaces window.alert() with elegant confirmation modals and toast banners.
 */

export function ConfirmationModal({ isOpen, title, message, type = 'success', onClose, onConfirm, confirmText = "D'accord", cancelText }) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center gap-4">
          
          {/* Icon */}
          {isSuccess && (
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}

          {isError && (
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
          )}

          {!isSuccess && !isError && (
            <div className="w-16 h-16 rounded-full bg-terracotta-50 text-terracotta-600 flex items-center justify-center border border-terracotta-100">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
          )}

          <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

          {/* Action buttons */}
          <div className="flex gap-3 w-full mt-2">
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-md transition ${
                isSuccess 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : isError 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-terracotta-600 hover:bg-terracotta-700'
              }`}
            >
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 py-3 px-5 rounded-xl shadow-lg text-white font-medium animate-slide-up transition-all ${
      isSuccess ? 'bg-emerald-600' : 'bg-terracotta-600'
    }`}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
        {isSuccess ? <polyline points="20 6 9 17 4 12"/> : <circle cx="12" cy="12" r="10"/>}
      </svg>
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100">✕</button>
    </div>
  );
}
