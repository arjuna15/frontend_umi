"use client";
import { useState, useEffect } from 'react';

// Singleton event emitter for toasts
export const toast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    // If the message contains "Gagal" or "Error", default to error type
    if (type === 'success' && (message.toLowerCase().includes('gagal') || message.toLowerCase().includes('error'))) {
      type = 'error';
    }
    const event = new CustomEvent('siakad_toast', { detail: { id: Date.now(), message, type } });
    window.dispatchEvent(event);
  } else {
    console.log(`[Toast ${type}] ${message}`);
  }
};

toast.success = (msg) => toast(msg, 'success');
toast.error = (msg) => toast(msg, 'error');
toast.info = (msg) => toast(msg, 'info');

if (typeof window !== 'undefined') {
  window.toast = toast;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('siakad_toast', handleToast);
    return () => window.removeEventListener('siakad_toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'var(--glass-bg)' : 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: t.type === 'error' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.5)',
          color: 'var(--color-text)',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          pointerEvents: 'auto',
          minWidth: '300px',
          borderLeft: t.type === 'error' ? '4px solid #ef4444' : '4px solid #10b981'
        }}>
          {t.type === 'error' ? (
            <i className="ph ph-x-circle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
          ) : t.type === 'info' ? (
            <i className="ph ph-info" style={{ fontSize: '1.5rem', color: '#3b82f6' }}></i>
          ) : (
            <i className="ph ph-check-circle" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
          )}
          <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{t.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
