import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100% - 40px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let bgColor = 'var(--color-navy)';
          let icon = <CheckCircle2 size={18} color="var(--color-success)" />;

          if (toast.type === 'error') {
            bgColor = 'var(--color-danger)';
            icon = <AlertCircle size={18} color="#ffffff" />;
          } else if (toast.type === 'info') {
            bgColor = 'var(--color-primary-dark)';
            icon = <Info size={18} color="#ffffff" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: bgColor,
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                fontSize: '0.875rem',
                fontWeight: '500',
                pointerEvents: 'auto',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
